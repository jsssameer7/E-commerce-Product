import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../src/models/index.js';
const {MONGODB_URI,ADMIN_EMAIL,ADMIN_PASSWORD,ADMIN_NAME='ElectroCompare Admin'}=process.env;
if(!MONGODB_URI||!ADMIN_EMAIL||!ADMIN_PASSWORD||ADMIN_PASSWORD.length<12){console.error('Set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD (12+ chars) in server/.env before running npm run create-admin.');process.exit(1);}
await mongoose.connect(MONGODB_URI);
const email=ADMIN_EMAIL.toLowerCase().trim();
const passwordHash=await bcrypt.hash(ADMIN_PASSWORD,12);
const user=await User.findOneAndUpdate({email},{$set:{name:ADMIN_NAME,email,passwordHash,role:'admin'}},{upsert:true,new:true,setDefaultsOnInsert:true});
console.log(`Administrator account provisioned for ${user.email}. Do not share these credentials.`);
await mongoose.disconnect();
