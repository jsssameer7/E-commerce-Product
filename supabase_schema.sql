-- ========================================================
-- SmartElectro Supabase Database Schema & Initial Data
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    avatar TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, avatar)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------
-- 2. PRODUCTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('smartphones', 'laptops', 'audio', 'wearables', 'gaming', 'cameras', 'tv')),
    price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    badge TEXT,
    stock INTEGER DEFAULT 10,
    specs JSONB DEFAULT '{}'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    release_date DATE,
    performance_score NUMERIC DEFAULT 0,
    features_score NUMERIC DEFAULT 0,
    value_score NUMERIC DEFAULT 0,
    recommended_use_cases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can insert/update products" 
    ON public.products FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- --------------------------------------------------------
-- 3. REVIEWS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author TEXT NOT NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
    ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------
-- 4. COUPONS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    value NUMERIC NOT NULL,
    min_spend NUMERIC DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons are viewable by everyone" 
    ON public.coupons FOR SELECT USING (true);

-- --------------------------------------------------------
-- 5. ORDERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ORD-' || floor(random() * 899999 + 100000)::text),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Out for Delivery', 'Delivered')),
    tracking_number TEXT,
    estimated_delivery TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
    ON public.orders FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can insert orders" 
    ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR user_id IS NULL);

-- --------------------------------------------------------
-- 6. WISHLIST TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist" 
    ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- ========================================================
-- SEED DATA (INITIAL PRODUCTS & COUPONS)
-- ========================================================

-- Insert Sample Coupons
INSERT INTO public.coupons (code, discount_type, value, min_spend, description) VALUES
('SMART10', 'percent', 10, 10000, '10% OFF on all orders above ₹10,000'),
('FESTIVE2000', 'fixed', 2000, 30000, '₹2,000 Flat Discount on purchases above ₹30,000'),
('WELCOME500', 'fixed', 500, 5000, '₹500 OFF for first-time buyers on orders above ₹5,000'),
('GAMING15', 'percent', 15, 40000, '15% OFF on Laptops & Gaming Consoles')
ON CONFLICT (code) DO NOTHING;

-- Insert Sample Products
INSERT INTO public.products (id, name, brand, category, price, original_price, rating, review_count, image, images, badge, stock, specs, highlights, description, pros, cons, release_date, performance_score, features_score, value_score, recommended_use_cases) VALUES
(
    'phone-1',
    'Apex Pro 16 Max',
    'Apex',
    'smartphones',
    139900,
    149900,
    4.9,
    342,
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Editor''s Choice',
    15,
    '{"display": "6.9\" Super Retina XDR OLED (120Hz)", "processor": "A18 Pro Octa-core Neural Engine", "ram": "8 GB LPDDR5X", "storage": "256 GB NVMe", "battery": "4685 mAh (30W Fast Charge)", "camera": "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto", "os": "iOS 18", "weight": "227 grams"}'::jsonb,
    '["Titanium frame with micro-blasted finish", "4K 120 fps Dolby Vision video recording", "Action button & dedicated Camera Control key"]'::jsonb,
    'The flagship smartphone with Grade 5 Titanium design, groundbreaking camera system, and ultra-fast A18 Pro processing capability.',
    '["Superb 5x telephoto camera", "Exceptional battery endurance", "Bright 3000 nit display"]'::jsonb,
    '["Slightly heavy in hand", "High entry price tag"]'::jsonb,
    '2024-09-20',
    9.8,
    9.6,
    9.0,
    '["4K Video & Photography", "Heavy Gaming", "Business & Executive"]'::jsonb
),
(
    'phone-2',
    'Galaxy Ultra X25',
    'Samsung',
    'smartphones',
    129900,
    139900,
    4.8,
    418,
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Seller',
    22,
    '{"display": "6.8\" Dynamic AMOLED 2X (120Hz)", "processor": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12 GB LPDDR5X", "storage": "512 GB UFS 4.0", "battery": "5000 mAh (45W Super Fast)", "camera": "200MP Quad Camera with S-Pen", "os": "Android 15 / One UI 7"}',
    '["Built-in S-Pen stylus", "200MP sensor with 100x Space Zoom", "Galaxy AI feature suite"]'::jsonb,
    'Ultimate productivity powerhouse featuring integrated S-Pen, galaxy AI features, and 200MP resolution photography.',
    '["Versatile quadruple camera", "S-Pen built-in convenience", "7 years of OS updates"]'::jsonb,
    '["Box does not include charger", "Large screen width"]'::jsonb,
    '2024-01-24',
    9.7,
    9.8,
    9.1,
    '["Digital Art & Note Taking", "Multitasking & Office", "Zoom Photography"]'::jsonb
),
(
    'laptop-1',
    'MacBook Pro 16 M3 Max',
    'Apple',
    'laptops',
    249900,
    269900,
    4.9,
    184,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Top Rated',
    8,
    '{"display": "16.2\" Liquid Retina XDR (120Hz ProMotion)", "processor": "Apple M3 Max 16-Core CPU / 40-Core GPU", "ram": "36 GB Unified Memory", "storage": "1 TB Superfast SSD", "battery": "100Wh (Up to 22 hrs)", "os": "macOS Sequoia", "weight": "2.14 kg"}'::jsonb,
    '["Hardware-accelerated ray tracing", "Liquid Retina XDR screen with 1600 nits peak brightness", "HDMI 2.1, SDXC card slot, MagSafe 3"]'::jsonb,
    'The workstation for extreme creative workflows, 3D rendering, machine learning models, and software developers.',
    '["Unrivaled M3 Max GPU power", "Silent fan operation", "Up to 22-hour battery life"]'::jsonb,
    '["RAM non-upgradable after purchase", "Premium pricing"]'::jsonb,
    '2023-11-07',
    9.9,
    9.7,
    8.8,
    '["3D Animation & Rendering", "8K Video Editing", "AI & Software Engineering"]'::jsonb
),
(
    'laptop-2',
    'ROG Strix Scar 18',
    'ASUS',
    'laptops',
    199900,
    219900,
    4.7,
    129,
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Value',
    12,
    '{"display": "18\" ROG Nebula HDR Mini-LED 240Hz", "processor": "Intel Core i9-14900HX 24-core", "ram": "32 GB DDR5 5600MHz", "storage": "2 TB PCIe 4.0 NVMe SSD", "battery": "90Wh (330W Adapter)", "camera": "RTX 4090 16GB GDDR6 (175W)", "os": "Windows 11 Home", "weight": "3.10 kg"}'::jsonb,
    '["NVIDIA GeForce RTX 4090 Laptop GPU", "Tri-Fan Cooling Technology & Liquid Metal", "Per-key RGB mechanical keyboard"]'::jsonb,
    'An unmatched 18-inch desktop-replacement gaming monster engineered for AAA gaming at ultra-high FPS.',
    '["Blazing 240Hz Mini-LED panel", "RTX 4090 raw graphical output", "Customizable Aura RGB"]'::jsonb,
    '["Heavy power brick", "Short unplugged battery life"]'::jsonb,
    '2024-02-15',
    9.8,
    9.5,
    9.2,
    '["AAA Hardcore Gaming", "4K Game Development", "VR Simulator"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    specs = EXCLUDED.specs;
