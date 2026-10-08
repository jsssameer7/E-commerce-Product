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

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Allow all operations for products" ON public.products;

CREATE POLICY "Products are viewable by everyone" 
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow all operations for products" 
    ON public.products FOR ALL USING (true) WITH CHECK (true);

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

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Allow all reviews operations" ON public.reviews;

CREATE POLICY "Reviews are viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Allow all reviews operations" 
    ON public.reviews FOR ALL USING (true) WITH CHECK (true);

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
DROP POLICY IF EXISTS "Coupons are viewable by everyone" ON public.coupons;
CREATE POLICY "Coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);

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
DROP POLICY IF EXISTS "Allow orders insert and view" ON public.orders;
CREATE POLICY "Allow orders insert and view" ON public.orders FOR ALL USING (true) WITH CHECK (true);

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
DROP POLICY IF EXISTS "Allow wishlist access" ON public.wishlists;
CREATE POLICY "Allow wishlist access" ON public.wishlists FOR ALL USING (true);

-- ========================================================
-- SEED DATA (COUPONS & ALL ELECTRONIC PRODUCTS)
-- ========================================================

-- Insert Sample Coupons
INSERT INTO public.coupons (code, discount_type, value, min_spend, description) VALUES
('SMART10', 'percent', 10, 10000, '10% OFF on all orders above ₹10,000'),
('FESTIVE2000', 'fixed', 2000, 30000, '₹2,000 Flat Discount on purchases above ₹30,000'),
('WELCOME500', 'fixed', 500, 5000, '₹500 OFF for first-time buyers on orders above ₹5,000'),
('GAMING15', 'percent', 15, 40000, '15% OFF on Laptops & Gaming Consoles')
ON CONFLICT (code) DO NOTHING;

-- Insert ALL Electronic Products into Supabase
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
    '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Editor''s Choice',
    15,
    '{"display": "6.9\" Super Retina XDR OLED", "processor": "A18 Pro Octa-core", "ram": "8 GB", "storage": "256 GB"}'::jsonb,
    '["Titanium frame", "4K 120 fps video recording"]'::jsonb,
    'Flagship smartphone with Grade 5 Titanium design and A18 Pro processor.',
    '["Superb camera", "Exceptional battery"]'::jsonb,
    '["High price"]'::jsonb,
    '2024-09-20',
    9.8,
    9.6,
    9.0,
    '["4K Video & Photography", "Heavy Gaming"]'::jsonb
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
    '{"display": "6.8\" Dynamic AMOLED 2X", "processor": "Snapdragon 8 Gen 4", "ram": "12 GB", "storage": "512 GB"}'::jsonb,
    '["Built-in S-Pen", "200MP Quad Camera", "Galaxy AI"]'::jsonb,
    'Ultimate productivity powerhouse with integrated S-Pen and 200MP camera.',
    '["Integrated S-Pen", "Anti-reflective glass"]'::jsonb,
    '["Large screen width"]'::jsonb,
    '2025-01-15',
    9.7,
    9.8,
    9.2,
    '["Productivity & Note Taking", "4K Photography"]'::jsonb
),
(
    'phone-3',
    'Pixel Vision 9 Pro',
    'Google',
    'smartphones',
    109900,
    119900,
    4.7,
    210,
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Top Rated',
    18,
    '{"display": "6.3\" Super Actua OLED", "processor": "Google Tensor G4", "ram": "16 GB", "storage": "256 GB"}'::jsonb,
    '["Gemini Nano AI", "Computational portrait camera", "16GB RAM"]'::jsonb,
    'Designed for AI computational photography enthusiasts with pure Android 15.',
    '["Clean UI", "Incredible portraits"]'::jsonb,
    ['30W charging speed']::jsonb,
    '2024-08-13',
    9.3,
    9.5,
    9.1,
    '["AI Workflow", "Clean Android"]'::jsonb
),
(
    'phone-4',
    'OnePlus Nord 13 Ultra',
    'OnePlus',
    'smartphones',
    59900,
    69900,
    4.85,
    154,
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Value',
    30,
    '{"display": "6.82\" 2K 120Hz AMOLED", "processor": "Snapdragon 8 Gen 4", "ram": "16 GB", "storage": "512 GB"}'::jsonb,
    '["100W SUPERVOOC fast charging", "6000mAh battery", "Hasselblad optics"]'::jsonb,
    'Speed champion with massive 6000mAh battery and 100W fast charger.',
    '["Fast charger included", "Huge battery"]'::jsonb,
    '["IP65 rating"]'::jsonb,
    '2024-12-05',
    9.6,
    9.3,
    9.8,
    '["Heavy Gaming", "Student Budget"]'::jsonb
),
(
    'laptop-1',
    'MacBook Pro 16 M4 Max',
    'Apple',
    'laptops',
    349900,
    369900,
    4.95,
    520,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Editor''s Choice',
    10,
    '{"display": "16.2\" Liquid Retina XDR", "processor": "Apple M4 Max", "ram": "48 GB", "storage": "1 TB SSD"}'::jsonb,
    '["M4 Max 40-core GPU", "Thunderbolt 5", "24 hour battery"]'::jsonb,
    'Ultimate workstation for 4K video editing, 3D graphics, and software engineering.',
    '["Unmatched performance", "Liquid Retina XDR"]'::jsonb,
    '["High cost"]'::jsonb,
    '2024-11-08',
    9.9,
    9.7,
    8.9,
    '["4K Video Editing", "Software Engineering"]'::jsonb
),
(
    'laptop-2',
    'Asus Vivobook Pro 15 OLED',
    'Asus',
    'laptops',
    64900,
    74900,
    4.8,
    290,
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Value',
    25,
    '{"display": "15.6\" 2.8K 120Hz OLED", "processor": "AMD Ryzen 7 7840HS", "ram": "16 GB", "storage": "1 TB SSD"}'::jsonb,
    '["2.8K 120Hz OLED screen", "Ryzen 7 processor", "1.65kg chassis"]'::jsonb,
    'Ideal laptop for college students, programming, and general creative work.',
    '["Gorgeous screen", "Fast Ryzen 7"]'::jsonb,
    '["Integrated graphics"]'::jsonb,
    '2024-05-15',
    9.1,
    9.4,
    9.7,
    '["College & Programming", "Student & Office"]'::jsonb
),
(
    'laptop-3',
    'Dell XPS 14 AI Touch',
    'Dell',
    'laptops',
    174900,
    189900,
    4.6,
    145,
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Top Rated',
    14,
    '{"display": "14.5\" 3.2K OLED Touch", "processor": "Intel Core Ultra 7 155H", "ram": "32 GB", "storage": "1 TB SSD"}'::jsonb,
    '["Copilot AI NPU Engine", "3.2K OLED Touch", "CNC Aluminum"]'::jsonb,
    'Premium executive ultrabook featuring zero-lattice keyboard and AI processing.',
    '["Sleek aesthetic", "Intel AI NPU"]'::jsonb,
    '["USB Type-C only"]'::jsonb,
    '2024-03-20',
    9.2,
    9.5,
    9.0,
    '["Business & Executive", "AI Workflows"]'::jsonb
),
(
    'laptop-4',
    'Lenovo Legion Pro 7i Gaming',
    'Lenovo',
    'laptops',
    219900,
    239900,
    4.9,
    312,
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Seller',
    12,
    '{"display": "16\" 240Hz 500 nits IPS", "processor": "Intel Core i9-14900HX", "ram": "32 GB", "storage": "2 TB SSD"}'::jsonb,
    '["NVIDIA RTX 4080 12GB", "Vapor Chamber Cooling", "Per-Key RGB"]'::jsonb,
    'Esport gaming monster powered by RTX 4080 graphics and 240Hz screen.',
    '["RTX 4080 graphics", "99.9Wh battery"]'::jsonb,
    '["2.8kg weight"]'::jsonb,
    '2024-02-10',
    9.8,
    9.6,
    9.3,
    '["AAA Gaming", "3D Animation"]'::jsonb
),
(
    'tv-1',
    'Bravia XR OLED 65" 4K',
    'Sony',
    'tv',
    219900,
    249900,
    4.9,
    189,
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Editor''s Choice',
    8,
    '{"display": "65\" 4K QD-OLED 120Hz", "processor": "Cognitive Processor XR", "ram": "4 GB", "storage": "32 GB"}'::jsonb,
    '["Cognitive Processor XR", "Acoustic Surface Audio+", "Perfect for PS5"]'::jsonb,
    'Cinema-grade QD-OLED TV with pure pitch-black levels and infinite contrast.',
    '["QD-OLED color volume", "Sound through screen glass"]'::jsonb,
    '["Higher price"]'::jsonb,
    '2024-04-12',
    9.9,
    9.8,
    9.0,
    '["Home Cinema Studio", "PS5 Gaming"]'::jsonb
),
(
    'tv-2',
    'Neo QLED 4K 55" Smart TV',
    'Samsung',
    'tv',
    99900,
    119900,
    4.75,
    240,
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Value',
    15,
    '{"display": "55\" 4K Quantum Mini-LED 144Hz", "processor": "NQ4 AI Gen2", "ram": "3 GB", "storage": "16 GB"}'::jsonb,
    '["Quantum Mini-LED", "144Hz VRR", "SolarCell Remote"]'::jsonb,
    'Ultra-bright Quantum Mini-LED 4K Smart TV with 144Hz refresh rate.',
    '["Bright Mini-LED", "144Hz gaming"]'::jsonb,
    '["No Dolby Vision"]'::jsonb,
    '2024-03-01',
    9.4,
    9.3,
    9.6,
    '["Living Room", "Sports & Action"]'::jsonb
),
(
    'audio-1',
    'QuietComfort Ultra Wireless',
    'Bose',
    'audio',
    35900,
    39900,
    4.8,
    512,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Top Rated',
    35,
    '{"display": "N/A", "processor": "Custom Bose DSP", "ram": "N/A", "storage": "N/A", "battery": "24 Hours"}'::jsonb,
    '["World-class ANC", "Bose Immersive Audio", "CustomTune sound"]'::jsonb,
    'Industry benchmark active noise cancelling wireless headphones.',
    '["Best noise isolation", "Plush earcups"]'::jsonb,
    '["Fixed presets"]'::jsonb,
    '2023-10-15',
    9.6,
    9.4,
    9.1,
    '["Travel & Flights", "Office Focus"]'::jsonb
),
(
    'audio-2',
    'AirPods Max 2 Type-C',
    'Apple',
    'audio',
    59900,
    59900,
    4.85,
    310,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Best Seller',
    20,
    '{"display": "N/A", "processor": "Dual Apple H1", "ram": "N/A", "storage": "N/A", "battery": "20 Hours"}'::jsonb,
    '["Aluminum ear cups", "Personalized Spatial Audio", "USB-C Lossless"]'::jsonb,
    'Over-ear headphones combining high-fidelity sound with Apple ecosystem magic.',
    '["Metal construction", "Seamless switching"]'::jsonb,
    '["Smart case soft"]'::jsonb,
    '2024-09-20',
    9.7,
    9.5,
    8.8,
    '["Apple Ecosystem", "Studio Music"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    specs = EXCLUDED.specs;
