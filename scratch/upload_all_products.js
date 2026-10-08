import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) envVars[key.trim()] = val.trim();
});

const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

// Read src/data/products.ts directly by dynamically importing or evaluating
const productsData = [
  // SMARTPHONES
  {
    id: 'phone-1',
    name: 'Apex Pro 16 Max',
    brand: 'Apex',
    category: 'smartphones',
    price: 139900,
    original_price: 149900,
    rating: 4.9,
    review_count: 342,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'],
    badge: "Editor's Choice",
    stock: 15,
    specs: { display: '6.9" Super Retina XDR OLED (120Hz, 3000 nits)', processor: 'A18 Pro Octa-core Neural Engine', ram: '8 GB LPDDR5X', storage: '256 GB NVMe', battery: '4685 mAh (30W Fast Charge)', camera: '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto', os: 'iOS 18', weight: '227 grams' },
    highlights: ['Titanium frame with micro-blasted finish', '4K 120 fps Dolby Vision video recording', 'Action button & dedicated Camera Control key'],
    description: 'The flagship smartphone with Grade 5 Titanium design, groundbreaking camera system, and ultra-fast A18 Pro processing capability.',
    pros: ['Superb 5x telephoto camera', 'Exceptional battery endurance', 'Bright 3000 nit display'],
    cons: ['Slightly heavy in hand', 'High entry price tag'],
    release_date: '2024-09-20',
    performance_score: 9.8,
    features_score: 9.6,
    value_score: 9.0,
    recommended_use_cases: ['4K Video & Photography', 'Heavy Gaming', 'Business & Executive']
  },
  {
    id: 'phone-2',
    name: 'Galaxy Ultra X25',
    brand: 'Samsung',
    category: 'smartphones',
    price: 129900,
    original_price: 139900,
    rating: 4.8,
    review_count: 418,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Seller',
    stock: 22,
    specs: { display: '6.8" Dynamic AMOLED 2X (1-120Hz)', processor: 'Snapdragon 8 Gen 4 Elite', ram: '12 GB LPDDR5X', storage: '512 GB UFS 4.0', battery: '5000 mAh (45W Wired)', camera: '200MP Main + 50MP Periscope + 50MP Ultra-Wide', os: 'Android 15 with One UI 7' },
    highlights: ['Built-in S Pen stylus with gesture controls', '200MP Quad-Telephoto Camera with 100x Space Zoom', 'Galaxy AI Live Translate & Circle to Search'],
    description: 'Ultimate power and productivity powerhouse with integrated S-Pen and 200MP quad-camera setup.',
    pros: ['Integrated S-Pen stylus', 'Anti-reflective screen glass', 'Versatile camera setup'],
    cons: ['Bulky boxy corners'],
    release_date: '2025-01-15',
    performance_score: 9.7,
    features_score: 9.8,
    value_score: 9.2,
    recommended_use_cases: ['Productivity & Note Taking', '4K Video & Photography', 'Heavy Gaming']
  },
  {
    id: 'phone-3',
    name: 'Pixel Vision 9 Pro',
    brand: 'Google',
    category: 'smartphones',
    price: 109900,
    original_price: 119900,
    rating: 4.7,
    review_count: 210,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'],
    badge: 'Top Rated',
    stock: 18,
    specs: { display: '6.3" Super Actua OLED (1-120Hz, 3000 nits)', processor: 'Google Tensor G4 with Titan M2', ram: '16 GB LPDDR5X', storage: '256 GB UFS 3.1', battery: '4700 mAh', camera: '50MP Main + 48MP Ultra-Wide + 48MP 5x Telephoto', os: 'Android 15 Pure Google' },
    highlights: ['Gemini Nano AI Assistant on-device', 'Best-in-class computational portrait & night photos', '16GB RAM standard'],
    description: 'Designed for AI computational photography enthusiasts with pure Android 15.',
    pros: ['Clean stock UI', '16GB RAM standard', 'Incredible portrait photos'],
    cons: ['30W charging speed'],
    release_date: '2024-08-13',
    performance_score: 9.3,
    features_score: 9.5,
    value_score: 9.1,
    recommended_use_cases: ['4K Video & Photography', 'Clean Android & AI Workflow', 'Daily Driver']
  },
  {
    id: 'phone-4',
    name: 'OnePlus Nord 13 Ultra',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 59900,
    original_price: 69900,
    rating: 4.85,
    review_count: 154,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Value',
    stock: 30,
    specs: { display: '6.82" 2K 120Hz AMOLED', processor: 'Snapdragon 8 Gen 4', ram: '16 GB LPDDR5X', storage: '512 GB UFS 4.0', battery: '6000 mAh (100W SUPERVOOC)', camera: '50MP Sony LYT-808 + 64MP Periscope', os: 'OxygenOS 15' },
    highlights: ['100W SUPERVOOC fast charging (0 to 100% in 25m)', 'Massive 6000mAh battery capacity', 'Hasselblad color optics'],
    description: 'Speed champion with a massive 6000mAh battery and 100W fast charger.',
    pros: ['100W fast charger included', 'Huge 6000mAh battery', 'Unbeatable value for performance'],
    cons: ['IP65 rating'],
    release_date: '2024-12-05',
    performance_score: 9.6,
    features_score: 9.3,
    value_score: 9.8,
    recommended_use_cases: ['Heavy Gaming', 'College & Student Budget', 'Long Battery Endurance']
  },

  // LAPTOPS
  {
    id: 'laptop-1',
    name: 'MacBook Pro 16 M4 Max',
    brand: 'Apple',
    category: 'laptops',
    price: 349900,
    original_price: 369900,
    rating: 4.95,
    review_count: 520,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
    badge: "Editor's Choice",
    stock: 10,
    specs: { display: '16.2" Liquid Retina XDR (120Hz ProMotion)', processor: 'Apple M4 Max (16-core CPU, 40-core GPU)', ram: '48 GB Unified Memory', storage: '1 TB PCIe NVMe SSD', battery: '100Wh (Up to 24 hours)', os: 'macOS Sequoia' },
    highlights: ['M4 Max chip with 40-core GPU acceleration', 'Thunderbolt 5 support up to 120Gbps', '24 hour battery endurance'],
    description: 'Ultimate workstation for 4K/8K video editing, 3D graphics, and software engineering.',
    pros: ['Unmatched render performance', 'Liquid Retina XDR screen', '24 hr battery'],
    cons: ['High memory upgrade cost'],
    release_date: '2024-11-08',
    performance_score: 9.9,
    features_score: 9.7,
    value_score: 8.9,
    recommended_use_cases: ['4K Video Editing & Design', 'Software Engineering & AI', 'Workstation Studio']
  },
  {
    id: 'laptop-2',
    name: 'Asus Vivobook Pro 15 OLED',
    brand: 'Asus',
    category: 'laptops',
    price: 64900,
    original_price: 74900,
    rating: 4.8,
    review_count: 290,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Value',
    stock: 25,
    specs: { display: '15.6" 2.8K 120Hz OLED Display', processor: 'AMD Ryzen 7 7840HS Octa-Core', ram: '16 GB LPDDR5', storage: '1 TB PCIe NVMe SSD', battery: '70Wh', os: 'Windows 11 Home' },
    highlights: ['Vibrant 2.8K 120Hz OLED screen for rich color accuracy', 'Ryzen 7 7840HS high speed multithreaded processing', 'Lightweight 1.65kg slim aluminum chassis'],
    description: 'Ideal laptop for college students, programming, and general creative work with a stunning OLED display.',
    pros: ['Gorgeous 2.8K OLED screen', 'Fast Ryzen 7 processor', 'Excellent value for money under ₹65k'],
    cons: ['Integrated graphics'],
    release_date: '2024-05-15',
    performance_score: 9.1,
    features_score: 9.4,
    value_score: 9.7,
    recommended_use_cases: ['College & Programming', 'Student & Daily Office', 'Casual Editing']
  },
  {
    id: 'laptop-3',
    name: 'Dell XPS 14 AI Touch',
    brand: 'Dell',
    category: 'laptops',
    price: 174900,
    original_price: 189900,
    rating: 4.6,
    review_count: 145,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'],
    badge: 'Top Rated',
    stock: 14,
    specs: { display: '14.5" 3.2K 120Hz OLED Touchscreen', processor: 'Intel Core Ultra 7 155H NPU AI', ram: '32 GB LPDDR5X', storage: '1 TB PCIe Gen4 SSD', battery: '69.5Wh', os: 'Windows 11 Pro' },
    highlights: ['Dedicated Copilot AI NPU Engine', 'InfinityEdge 3.2K OLED Touch screen', 'CNC Aluminum with Gorilla Glass 3'],
    description: 'Premium executive ultrabook featuring zero-lattice keyboard, haptic glass touchpad, and Core Ultra AI processing.',
    pros: ['Ultra-sleek minimal aesthetic', 'Intel AI NPU engine', '3.2K OLED Touch screen'],
    cons: ['Limited USB Type-C ports only'],
    release_date: '2024-03-20',
    performance_score: 9.2,
    features_score: 9.5,
    value_score: 9.0,
    recommended_use_cases: ['Business & Executive', 'AI Workflows', 'Travel Ultrabook']
  },
  {
    id: 'laptop-4',
    name: 'Lenovo Legion Pro 7i Gaming',
    brand: 'Lenovo',
    category: 'laptops',
    price: 219900,
    original_price: 239900,
    rating: 4.9,
    review_count: 312,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Seller',
    stock: 12,
    specs: { display: '16" WQXGA 240Hz 500 nits IPS', processor: 'Intel Core i9-14900HX 24-core', ram: '32 GB DDR5 5600MHz', storage: '2 TB PCIe 4.0 NVMe SSD', battery: '99.9Wh', os: 'Windows 11 Home' },
    highlights: ['NVIDIA GeForce RTX 4080 12GB (175W TGP)', 'Coldfront 5.0 Vapor Chamber Cooling', 'TrueStrike Per-Key RGB Keyboard'],
    description: 'Uncompromising esport gaming monster powered by RTX 4080 graphics and 240Hz screen.',
    pros: ['RTX 4080 desktop-class gaming output', 'Coldfront vapor chamber cooling', '99.9Wh maximum battery allowed on flights'],
    cons: ['2.8kg weight'],
    release_date: '2024-02-10',
    performance_score: 9.8,
    features_score: 9.6,
    value_score: 9.3,
    recommended_use_cases: ['AAA Hardcore Gaming', '3D Animation & Rendering', 'Game Development']
  },

  // TV & DISPLAYS
  {
    id: 'tv-1',
    name: 'Bravia XR OLED 65" 4K',
    brand: 'Sony',
    category: 'tv',
    price: 219900,
    original_price: 249900,
    rating: 4.9,
    review_count: 189,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'],
    badge: "Editor's Choice",
    stock: 8,
    specs: { display: '65" 4K QD-OLED (120Hz, VRR, ALLM)', processor: 'Cognitive Processor XR', ram: '4 GB', storage: '32 GB', battery: 'N/A', os: 'Google TV' },
    highlights: ['Cognitive Processor XR mimics human sight & focus', 'Acoustic Surface Audio+ produces sound directly from screen', 'Perfect for PlayStation 5 auto HDR'],
    description: 'Cinema-grade QD-OLED TV with pure pitch-black levels, infinite contrast ratio, and XR Cognitive AI image processing.',
    pros: ['Unmatched QD-OLED color volume', 'Sound emits directly through screen glass', 'PS5 Auto HDR tone mapping'],
    cons: ['Higher price tier'],
    release_date: '2024-04-12',
    performance_score: 9.9,
    features_score: 9.8,
    value_score: 9.0,
    recommended_use_cases: ['Home Cinema Studio', 'PS5 & Console Gaming', 'Living Room']
  },
  {
    id: 'tv-2',
    name: 'Neo QLED 4K 55" Smart TV',
    brand: 'Samsung',
    category: 'tv',
    price: 99900,
    original_price: 119900,
    rating: 4.75,
    review_count: 240,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Value',
    stock: 15,
    specs: { display: '55" 4K Quantum Mini-LED (144Hz VRR)', processor: 'NQ4 AI Gen2 Processor', ram: '3 GB', storage: '16 GB', battery: 'N/A', os: 'Tizen OS' },
    highlights: ['Quantum Matrix Technology with Mini-LED precision', 'Motion Xcelerator 144Hz gaming support', 'SolarCell Remote powered by indoor light'],
    description: 'Ultra-bright Quantum Mini-LED 4K Smart TV with 144Hz refresh rate for bright rooms and gaming setup.',
    pros: ['Ultra bright Mini-LED backlighting', '144Hz VRR gaming mode', 'No battery solar remote'],
    cons: ['No Dolby Vision support (supports HDR10+)'],
    release_date: '2024-03-01',
    performance_score: 9.4,
    features_score: 9.3,
    value_score: 9.6,
    recommended_use_cases: ['Bright Living Room', 'Sports & Fast Action', 'Console Gaming']
  },

  // AUDIO & SOUND
  {
    id: 'audio-1',
    name: 'QuietComfort Ultra Wireless',
    brand: 'Bose',
    category: 'audio',
    price: 35900,
    original_price: 39900,
    rating: 4.8,
    review_count: 512,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    badge: 'Top Rated',
    stock: 35,
    specs: { display: 'N/A', processor: 'Custom Bose DSP & Immersive Audio Engine', ram: 'N/A', storage: 'N/A', battery: '24 Hours (Fast Charge: 15 min = 2.5 hrs)', os: 'Bose Music App' },
    highlights: ['World-class noise cancellation (ANC)', 'Bose Immersive Audio spatial soundstage', 'CustomTune sound personalization'],
    description: 'Industry benchmark active noise cancelling wireless headphones with spatial audio and luxurious ear cushion comfort.',
    pros: ['Best-in-class noise isolation', 'Supreme plush earcups', 'Spacious soundstage'],
    cons: ['Non-customizable EQ presets'],
    release_date: '2023-10-15',
    performance_score: 9.6,
    features_score: 9.4,
    value_score: 9.1,
    recommended_use_cases: ['Travel & Flights', 'Office Focus', 'Audiophile Music']
  },
  {
    id: 'audio-2',
    name: 'AirPods Max 2 Type-C',
    brand: 'Apple',
    category: 'audio',
    price: 59900,
    original_price: 59900,
    rating: 4.85,
    review_count: 310,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'],
    badge: 'Best Seller',
    stock: 20,
    specs: { display: 'N/A', processor: 'Apple H1 Chip in each ear cup', ram: 'N/A', storage: 'N/A', battery: '20 Hours with ANC & Spatial Audio', os: 'iOS / macOS Seamless Switching' },
    highlights: ['Anodized aluminum ear cups with breathable mesh headband', 'Personalized Spatial Audio with dynamic head tracking', 'USB-C Lossless Audio charging'],
    description: 'Over-ear headphones combining high-fidelity sound with Apple ecosystem magic.',
    pros: ['Premium aluminum metal construction', 'Seamless Apple device switching', 'Lossless USB-C audio'],
    cons: ['Smart Case lacks rigidity'],
    release_date: '2024-09-20',
    performance_score: 9.7,
    features_score: 9.5,
    value_score: 8.8,
    recommended_use_cases: ['Apple Ecosystem', 'Studio Music Listening', 'Executive Lifestyle']
  }
];

async function seed() {
  console.log('Seeding products to Supabase...');
  for (const item of productsData) {
    const { error } = await supabase.from('products').upsert(item, { onConflict: 'id' });
    if (error) {
      console.error(`Failed to insert ${item.id}:`, error);
    } else {
      console.log(`Successfully uploaded product: ${item.name} (${item.id})`);
    }
  }
  const { data } = await supabase.from('products').select('id, name');
  console.log('Total products now in Supabase:', data?.length);
}

seed();
