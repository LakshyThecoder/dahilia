-- Italian Restaurant Loyalty Platform - Database Schema

-- Restaurants table
CREATE TABLE restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo VARCHAR(500),
    whatsapp_number VARCHAR(20),
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    last_visit_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, phone_number)
);

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    points_earned INTEGER NOT NULL,
    points_redeemed INTEGER DEFAULT 0,
    reward_redeemed_id UUID,
    created_by_employee UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards/Offers table
CREATE TABLE rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    reward_name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL, -- 'discount', 'free_item', 'percentage_off'
    discount_value DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_segment VARCHAR(50), -- 'all', 'vip', 'inactive', 'new'
    delivery_channel VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'sms'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'staff', -- 'owner', 'manager', 'staff'
    pin_code VARCHAR(10),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    points_used INTEGER NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' -- 'active', 'used', 'expired'
);

-- Insert sample Italian restaurant
INSERT INTO restaurants (name, slug, whatsapp_number, subscription_plan) VALUES 
('Bella Italia', 'bella-italia', '+1234567890', 'premium');

-- Insert sample rewards
INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value) 
SELECT 
    id,
    'Free Appetizer',
    'Choose any appetizer from our menu for free',
    500,
    'free_item',
    12.99
FROM restaurants WHERE slug = 'bella-italia';

INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value) 
SELECT 
    id,
    '20% Off Dinner',
    'Get 20% off your entire dinner bill',
    750,
    'percentage_off',
    20.00
FROM restaurants WHERE slug = 'bella-italia';

INSERT INTO rewards (restaurant_id, reward_name, description, points_required, reward_type, discount_value) 
SELECT 
    id,
    'Free Dinner',
    'Enjoy a complimentary dinner up to $50 value',
    2000,
    'free_item',
    50.00
FROM restaurants WHERE slug = 'bella-italia';

-- Create indexes for performance
CREATE INDEX idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_qr_token ON customers(qr_token);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_restaurant_id ON transactions(restaurant_id);
CREATE INDEX idx_rewards_restaurant_id ON rewards(restaurant_id);
CREATE INDEX idx_redemptions_customer_id ON redemptions(customer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON rewards FOR SELECT USING (true);

-- Note: More restrictive policies should be added based on authentication setup
