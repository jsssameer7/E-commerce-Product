import { Router } from 'express';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { Product, Order } from '../models/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
const addressSchema = z.object({ fullName:z.string().trim().min(2).max(100), email:z.string().email(), address:z.string().trim().min(5).max(250), city:z.string().trim().min(2).max(100), state:z.string().trim().min(2).max(100), zipCode:z.string().regex(/^[1-9][0-9]{5}$/), country:z.string().trim().min(2).max(80) });
const createSchema = z.object({ items:z.array(z.object({productId:z.string().min(1),quantity:z.number().int().min(1).max(10)})).min(1).max(30, 'Too many cart lines'), shippingAddress:addressSchema, couponCode:z.string().max(40).optional(), shippingMethod:z.enum(['standard','express','overnight']).default('express') });
function getRazorpay() {
 if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw Object.assign(new Error('Razorpay is not configured.'),{status:503,publicMessage:'Payments are not configured. Add Razorpay test credentials to server/.env and restart the API.'});
 }
 return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
}
router.post('/checkout', requireAuth, async (req,res,next)=>{
 try {
  const input=createSchema.parse(req.body);
   const rp=getRazorpay();
   const ids=input.items.map(i=>i.productId);
   const products=await Product.find({productId:{$in:ids}}).lean();
  if(products.length!==new Set(ids).size) return res.status(400).json({error:'One or more products are unavailable.'});
  const byId=new Map(products.map(p=>[p.productId,p]));
  const items=input.items.map(i=>{const p=byId.get(i.productId);if(!p || p.stock<i.quantity) throw Object.assign(new Error(`Insufficient stock for ${p?.name || i.productId}.`),{status:409});return {productId:p.productId,name:p.name,image:p.image,unitPrice:p.price,quantity:i.quantity};});
  const subtotal=items.reduce((sum,i)=>sum+i.unitPrice*i.quantity,0);
  let discount=0;
  const coupon=input.couponCode?.toUpperCase();
  if(coupon==='TECH10' && subtotal>=15000) discount=Math.round(subtotal*.10);
  else if(coupon==='COMPARE2000' && subtotal>=10000) discount=2000;
  else if(coupon==='FREESHIP' && subtotal>=2000) discount=500;
  else if(coupon==='FESTIVE5000' && subtotal>=50000) discount=5000;
  const taxable=Math.max(0,subtotal-discount), tax=Math.round(taxable*0.18);
  const shipping={standard:0,express:299,overnight:599}[input.shippingMethod];
  const total=taxable+tax+shipping;
  const order=await Order.create({user:req.user._id,items,subtotal,discount,tax,shipping,total,shippingAddress:input.shippingAddress,paymentStatus:'pending',status:'Processing'});
  let rpOrder;
  try {
   rpOrder=await rp.orders.create({amount:total*100,currency:'INR',receipt:order._id.toString(),notes:{orderId:order._id.toString(),userId:req.user._id.toString()}});
  } catch(error) {
   order.paymentStatus='failed';
   await order.save();
   console.error('Razorpay order creation failed:',error);
   throw Object.assign(new Error('Razorpay order creation failed.'),{status:502,publicMessage:'Razorpay could not create the payment order. Verify test-mode credentials and server logs.'});
  }
  order.razorpayOrderId=rpOrder.id; await order.save();
  res.status(201).json({orderId:order._id,razorpayOrderId:rpOrder.id,amount:rpOrder.amount,currency:rpOrder.currency,keyId:process.env.RAZORPAY_KEY_ID,breakdown:{subtotal,discount,tax,shipping,total}});
 } catch(e){next(e);}
});
router.post('/:id/verify-payment', requireAuth, async (req,res,next)=>{
 try {
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)return res.status(400).json({error:'Missing payment verification fields.'});
  const order=await Order.findOne({_id:req.params.id,user:req.user._id});
  if(!order)return res.status(404).json({error:'Order not found.'});
  if(order.paymentStatus==='paid')return res.json({verified:true,orderId:order._id,status:order.status});
  if(order.razorpayOrderId!==razorpay_order_id)return res.status(400).json({error:'Payment order does not match this checkout.'});
  const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET || '').update(`${razorpay_order_id}|${razorpay_payment_id}`).digest();
  let provided; try{provided=Buffer.from(razorpay_signature,'hex');}catch{return res.status(400).json({error:'Invalid signature.'});}
  if(!process.env.RAZORPAY_KEY_SECRET || expected.length!==provided.length || !crypto.timingSafeEqual(expected,provided))return res.status(400).json({error:'Payment signature verification failed.'});
  order.paymentStatus='paid';order.razorpayPaymentId=razorpay_payment_id;await order.save();
  await Promise.all(order.items.map(i=>Product.updateOne({productId:i.productId,stock:{$gte:i.quantity}},{$inc:{stock:-i.quantity}})));
  res.json({verified:true,orderId:order._id,status:order.status});
 }catch(e){next(e);}
});
router.get('/mine', requireAuth, async(req,res,next)=>{try{const orders=await Order.find({user:req.user._id}).sort({createdAt:-1}).lean();res.json({items:orders});}catch(e){next(e);}});
router.get('/', requireAuth, requireAdmin, async(req,res,next)=>{try{const orders=await Order.find().populate('user','name email').sort({createdAt:-1}).limit(500).lean();res.json({items:orders});}catch(e){next(e);}});
router.patch('/:id/status', requireAuth, requireAdmin, async(req,res,next)=>{try{const statusSchema=z.enum(['Processing','Shipped','Out for Delivery','Delivered','Cancelled','Refunded']);const status=statusSchema.parse(req.body.status);const order=await Order.findByIdAndUpdate(req.params.id,{status},{new:true,runValidators:true});if(!order)return res.status(404).json({error:'Order not found.'});res.json({order});}catch(e){next(e);}});
export default router;
