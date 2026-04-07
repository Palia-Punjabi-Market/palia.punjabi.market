-- Palia Punjabi Market Database Schema

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📦',
  image_url TEXT,
  price DECIMAL(10,2),
  category TEXT NOT NULL,
  origin TEXT NOT NULL,
  description TEXT,
  is_top BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  weight_prices JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_surname TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  cap TEXT,
  delivery_type TEXT NOT NULL,
  delivery_price DECIMAL(10,2) DEFAULT 0,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'preparazione',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (for simple admin check)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin
INSERT INTO admin_users (email) VALUES ('jasraj930@gmail.com') ON CONFLICT (email) DO NOTHING;
