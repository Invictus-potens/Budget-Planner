# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a name and set a database password
4. Wait for the project to be created

## 2. Get Environment Variables

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon/Public key

3. Add these to your Railway environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 3. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create tables
create table public.budget_limits (
  id serial not null,
  user_id uuid null,
  category_id text not null,
  limit_amount numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint budget_limits_pkey primary key (id),
  constraint budget_limits_user_id_category_id_key unique (user_id, category_id),
  constraint budget_limits_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_budget_limits_user_id on public.budget_limits using btree (user_id) TABLESPACE pg_default;

create trigger update_budget_limits_updated_at BEFORE
update on budget_limits for EACH row
execute FUNCTION update_updated_at_column ();

create table public.transactions (
  id text not null,
  user_id uuid null,
  description text not null,
  amount numeric(10, 2) not null,
  category text not null,
  type text not null,
  date date not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint transactions_type_check check (
    (
      type = any (array['income'::text, 'expense'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_transactions_user_id on public.transactions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_transactions_date on public.transactions using btree (date) TABLESPACE pg_default;

create trigger update_transactions_updated_at BEFORE
update on transactions for EACH row
execute FUNCTION update_updated_at_column ();

create table public.user_financial_settings (
  user_id uuid not null,
  salary numeric null,
  payday integer null,
  currency text null,
  constraint user_financial_settings_pkey primary key (user_id),
  constraint user_financial_settings_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_budget_limits_user_id ON budget_limits(user_id);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own budget limits" ON budget_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget limits" ON budget_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget limits" ON budget_limits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget limits" ON budget_limits
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. Authentication Settings

1. Go to Authentication → Settings in Supabase dashboard
2. Configure your site URL (your Railway app URL)
3. Add any additional redirect URLs if needed
4. Enable email confirmations (recommended for production)

## 5. Deploy to Railway

1. Add the environment variables to Railway
2. Deploy your app
3. Test the authentication flow

## Features Added

✅ **User Authentication**
- Email/password registration and login
- Secure session management
- User-specific data isolation

✅ **Database Integration**
- Transactions stored per user
- Budget limits stored per user
- Row Level Security (RLS) enabled
- Automatic data persistence

✅ **Consistent Design**
- Login/Register forms match existing UI
- Purple/pink gradient theme maintained
- Responsive design
- Loading states and error handling

## Security Features

- Row Level Security ensures users can only access their own data
- Password validation (minimum 6 characters)
- Email confirmation for new accounts
- Secure session management with Supabase Auth 