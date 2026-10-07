-- ═══════════════════════════════════════════════════════════════
-- VIRTUX GAMING HUB — SUPABASE DATABASE SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ═══════════════════════════════════════════════════════════════

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  membership_id TEXT UNIQUE,
  stamps_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STAMP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.stamp_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  membership_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  bill_amount NUMERIC DEFAULT 150,
  bill_notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER DEFAULT 5,
  service TEXT DEFAULT 'General',
  comment TEXT NOT NULL,
  is_featured INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  booking_date TEXT,
  booking_time TEXT,
  duration TEXT,
  guests INTEGER DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  badge TEXT DEFAULT '🔥 NEW',
  message TEXT NOT NULL,
  link TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CAFE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cafe_items (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  badge TEXT,
  is_available INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════ SEED INITIAL DATA ════════════════
-- Default Admin Account: admin@virtux.com / admin123
INSERT INTO public.users (name, email, password, phone, role, membership_id, stamps_count)
VALUES (
  'Virtux Admin',
  'admin@virtux.com',
  '$2b$10$FEjIMHcE4RPqSWroBaUcteY5Q77zwpNbyiKrNZPv2wSFbUgivuJ.W', -- valid bcrypt hash of admin123
  '+91 91477 18768',
  'admin',
  'VIRTUXGAMING000000001',
  10
)
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Cafe Items
INSERT INTO public.cafe_items (category, name, description, price, original_price, badge, is_available)
VALUES 
  ('Combos', '⚡ Gamer Fuel Combo', 'Monster Energy / Red Bull + Peri Peri Fries + Warm Chocolate Brownie', 249, 330, '🔥 Most Popular', 1),
  ('Combos', '🎮 Solo Grind Pack', 'Signature Cold Coffee + Grilled Club Sandwich + Pringles Snack Can', 229, 310, NULL, 1),
  ('Combos', '👥 4-Player LAN Party Pack', '4× Chilled Soft Drinks + 2× Loaded Cheesy Fries + 1× Large Nachos + 1× Tub Popcorn', 399, 560, '👥 Squad Saver', 1),
  ('Beverages', 'Signature Cold Coffee', 'Rich espresso blended with thick milk and vanilla ice cream', 119, NULL, NULL, 1),
  ('Beverages', 'Monster Energy Drink', 'Ice-cold canned energy boost (350ml)', 125, NULL, NULL, 1),
  ('Snacks', 'Peri Peri Crinkle Fries', 'Crispy spiced crinkle cut fries with cheesy dip', 99, NULL, NULL, 1)
ON CONFLICT DO NOTHING;

-- ════════════════ ENABLE ROW LEVEL SECURITY & POLICIES ════════════════
-- Allow public access for anon key to query and insert (since authentication is managed by the app backend)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_items ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon key
CREATE POLICY "Allow public all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on stamp_requests" ON public.stamp_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on cafe_items" ON public.cafe_items FOR ALL USING (true) WITH CHECK (true);

