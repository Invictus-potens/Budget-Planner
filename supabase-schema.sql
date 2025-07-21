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

-- Family Groups Table
create table public.family_groups (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  name text,
  created_at timestamp with time zone default now()
);

-- Family Members Table
create table public.family_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.family_groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  invited_email text,
  role text default 'member', -- 'owner' or 'member'
  status text default 'pending', -- 'pending', 'active'
  invited_at timestamp with time zone default now(),
  accepted_at timestamp with time zone
);

-- Index for quick lookup
create index if not exists idx_family_members_group_id on public.family_members(group_id);
create index if not exists idx_family_members_user_id on public.family_members(user_id);

-- Add group_id to transactions
alter table public.transactions add column group_id uuid references public.family_groups(id);

-- Add group_id to budget_limits
alter table public.budget_limits add column group_id uuid references public.family_groups(id);

-- Add group_id to user_financial_settings
alter table public.user_financial_settings add column group_id uuid references public.family_groups(id);

-- Allow group members to view transactions
create policy "Group members can view transactions" on transactions
  for select using (
    group_id in (
      select group_id from public.family_members
      where user_id = auth.uid() and status = 'active'
    )
  );

-- Allow group members to insert transactions
create policy "Group members can insert transactions" on transactions
  for insert with check (
    group_id in (
      select group_id from public.family_members
      where user_id = auth.uid() and status = 'active'
    )
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_limits_updated_at 
  BEFORE UPDATE ON budget_limits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 