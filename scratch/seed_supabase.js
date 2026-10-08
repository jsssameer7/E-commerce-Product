import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) envVars[key.trim()] = val.trim();
});

const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', url);

const supabase = createClient(url, key);

// Read products array from src/data/products.ts using simple regex or node execution
const productsTsPath = path.resolve('src/data/products.ts');
const fileContent = fs.readFileSync(productsTsPath, 'utf-8');

// Simple script to test connecting and verifying count
async function run() {
  const { data, count, error } = await supabase.from('products').select('*', { count: 'exact' });
  if (error) {
    console.error('Error querying Supabase:', error);
  } else {
    console.log('Current product count in Supabase:', data?.length);
    console.log('Products:', data.map(p => p.name));
  }
}

run();
