import 'dotenv/config';
import mongoose from 'mongoose';
import { Product, PricePoint } from '../src/models/index.js';
import { readFile } from 'node:fs/promises';
if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in server/.env first.');process.exit(1);}
await mongoose.connect(process.env.MONGODB_URI);
const products=JSON.parse(await readFile(new URL('../seed-products.json',import.meta.url),'utf8'));
for(const p of products){
 const data={...p,productId:p.id};delete data.id;
 await Product.updateOne({productId:data.productId},{$setOnInsert:data},{upsert:true});
 const latest=await PricePoint.findOne({productId:data.productId}).sort({recordedAt:-1});
 if(!latest)await PricePoint.create({productId:data.productId,price:data.price});
}
console.log(`Seeded ${products.length} catalog products (existing records were preserved).`);
await mongoose.disconnect();
