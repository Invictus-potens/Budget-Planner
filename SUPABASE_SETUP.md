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
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_limits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

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