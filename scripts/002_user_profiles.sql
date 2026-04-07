-- User profiles and order ownership extension

-- Dedicated profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  surname TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  cap TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional link from order to authenticated user
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Keep profile rows private by default
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_read_own_profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can insert/update their own profile
CREATE POLICY "users_upsert_own_profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
