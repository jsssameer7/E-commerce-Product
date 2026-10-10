import { Router } from 'express';
import { z } from 'zod';
import { Product, PricePoint, PriceAlert } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();
router.post('/assistant', async(req,res,next)=>{
 try {
  const {question}=z.object({question:z.string().trim().min(2).max(500)}).parse(req.body);
  const q=question.toLowerCase();

  const budgetMatch=
    q.match(/(?:under|below|within|upto|up to|budget(?:\s*of)?|max(?:imum)?(?:\s*budget)?|₹|rs\.?|inr)\s*([\d,]+)/i) ||
    q.match(/(^|\s)([\d]{4,7})(?=\s|$)/);
  const budget = budgetMatch
    ? Number((budgetMatch[1] || budgetMatch[2] || budgetMatch[0]).replace(/,/g, ''))
    : null;

  let category='';
  if(/laptop|notebook|ultrabook|programming|coding|college|student/i.test(q)) category='laptops';
  else if(/phone|mobile|smartphone|android|iphone|camera/i.test(q)) category='smartphones';
  else if(/headphone|earbud|speaker|audio|bluetooth|music/i.test(q)) category='audio';
  else if(/watch|wearable|smartwatch/i.test(q)) category='wearables';
  else if(/game|gaming|playstation|console/i.test(q)) category='gaming';
  else if(/tv|television|oled|qled/i.test(q)) category='tv';
  else if(/camera|dslr|mirrorless|lens/i.test(q)) category='cameras';

  const baseFilter={stock:{$gt:0}};
  if(category) baseFilter.category=category;
  if(budget) baseFilter.price={$lte:budget};

  let products=await Product.find(baseFilter).sort({valueScore:-1,rating:-1}).limit(5).lean();

  if(!products.length && budget){
    products=await Product.find({stock:{$gt:0}, price:{$lte:budget*1.2}}).sort({valueScore:-1,rating:-1}).limit(5).lean();
  }

  if(!products.length && category){
    products=await Product.find({stock:{$gt:0}}).sort({valueScore:-1,rating:-1}).limit(5).lean();
  }

  const answer=products.length?`Based on the catalog${budget?` and your budget of ₹${budget.toLocaleString('en-IN')}`:''}, consider these options. Compare specifications and current availability before buying.`:'I could not find an in-stock match for those constraints. Try a broader budget or category.';
  res.json({answer,mode:'catalog-based',products:products.map(p=>({id:p.productId,name:p.name,brand:p.brand,price:p.price,rating:p.rating,category:p.category,image:p.image,reason:`Value score ${p.valueScore ?? 'not rated'}; rating ${p.rating ?? 'N/A'}/5`}))});
 }catch(e){next(e);}
});
router.get('/prices/:productId',async(req,res,next)=>{try{const points=await PricePoint.find({productId:req.params.productId}).sort({recordedAt:1}).limit(365).lean();res.json({items:points});}catch(e){next(e);}});
router.post('/alerts',requireAuth,async(req,res,next)=>{try{const input=z.object({productId:z.string().min(1),targetPrice:z.number().positive()}).parse(req.body);if(!await Product.exists({productId:input.productId}))return res.status(404).json({error:'Product not found.'});const alert=await PriceAlert.create({user:req.user._id,...input});res.status(201).json({alert});}catch(e){next(e);}});
router.get('/alerts/mine',requireAuth,async(req,res,next)=>{try{const alerts=await PriceAlert.find({user:req.user._id,active:true}).sort({createdAt:-1}).lean();const ids=[...new Set(alerts.map(a=>a.productId))];const products=await Product.find({productId:{$in:ids}}).select('productId name price').lean();const byId=new Map(products.map(p=>[p.productId,p]));res.json({items:alerts.map(a=>({...a,product:byId.get(a.productId)||null,triggered:(byId.get(a.productId)?.price ?? Infinity)<=a.targetPrice}))});}catch(e){next(e);}});
router.delete('/alerts/:id',requireAuth,async(req,res,next)=>{try{const r=await PriceAlert.findOneAndUpdate({_id:req.params.id,user:req.user._id},{active:false},{new:true});if(!r)return res.status(404).json({error:'Alert not found.'});res.json({ok:true});}catch(e){next(e);}});
export default router;
