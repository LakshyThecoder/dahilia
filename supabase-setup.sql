-- =====================================================
-- DAHILIA OVEN - SUPABASE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- RESTAURANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  email TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CUSTOMERS TABLE (Loyalty Members)
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  qr_token TEXT UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  last_visit_at TIMESTAMP WITH TIME ZONE,
  phone TEXT,
  birthdate DATE,
  preferences TEXT[],
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSACTIONS TABLE (Points History)
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  restaurant_id UUID REFERENCES restaurants(id),
  amount DECIMAL(10,2) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  reward_redeemed_id UUID,
  created_by_employee UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REWARDS TABLE (Loyalty Rewards)
-- =====================================================
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  reward_name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT CHECK (reward_type IN ('discount', 'free_item', 'percentage_off')),
  discount_value DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAMPAIGNS TABLE (Email Campaigns)
-- =====================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_segment TEXT,
  delivery_channel TEXT DEFAULT 'email',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  sent_to INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMPLOYEES TABLE (Staff)
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('owner', 'manager', 'staff')),
  pin_code TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Customers: Users can only see their own data
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can update own data" ON customers
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow insert during signup
CREATE POLICY "Allow insert for authenticated users" ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Rewards: Everyone can see active rewards
CREATE POLICY "Anyone can view active rewards" ON rewards
  FOR SELECT USING (active = TRUE);

-- Campaigns: Only owners/managers can view
CREATE POLICY "Staff can view campaigns" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  );

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert Dahilia Oven as default restaurant
INSERT INTO restaurants (name, slug, logo, email)
VALUES (
  'Dahilia Oven', 
  'dahilia-oven', 
  'https://placehold.co/200x200/D4A574/FFF?text=DO',
  'loyalty@dahiliaoven.com'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample rewards
INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value)
SELECT 
  id,
  'Free Pastry',
  'Choose any pastry up to $5 value',
  100,
  'free_item',
  5.00
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value)
SELECT 
  id,
  '$10 Voucher',
  'Use on any purchase over $20',
  200,
  'discount',
  10.00
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value)
SELECT 
  id,
  'Free Coffee',
  'Any size hot coffee',
  50,
  'free_item',
  4.50
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value)
SELECT 
  id,
  '20% Off Bread',
  'Any artisan bread loaf',
  75,
  'percentage_off',
  20.00
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

-- Insert demo employee (PIN: 1234)
INSERT INTO employees (restaurant_id, name, email, role, pin_code, active)
SELECT 
  id,
  'Staff Member',
  'staff@dahiliaoven.com',
  'staff',
  '1234',
  TRUE
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

INSERT INTO employees (restaurant_id, name, email, role, pin_code, active)
SELECT 
  id,
  'Manager',
  'manager@dahiliaoven.com',
  'manager',
  '5678',
  TRUE
FROM restaurants WHERE slug = 'dahilia-oven'
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENABLE REALTIME FOR TRANSACTIONS
-- =====================================================
BEGIN;
  -- Drop if exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create publication
  CREATE PUBLICATION supabase_realtime;
  
  -- Add tables to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE customers;
COMMIT;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_restaurant_id ON rewards(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_rewards_active ON rewards(active);

-- =====================================================
-- DONE!
-- =====================================================
SELECT '✅ Dahilia Oven database setup complete!' as status;
