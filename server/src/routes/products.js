import { Router } from 'express';
import { z } from 'zod';
import { Product, PricePoint } from '../models/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
 try {
  const { q, category, brand, minPrice, maxPrice, inStock, sort = 'featured', page = '1', limit = '100' } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (brand) filter.brand = brand;
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (q) filter.$text = { $search: String(q).slice(0, 100) };
  const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, rating: { rating: -1 }, newest: { releaseDate: -1 }, value: { valueScore: -1 }, featured: { rating: -1, reviewCount: -1 } };
  const safePage = Math.max(1, Number(page) || 1), safeLimit = Math.min(100, Math.max(1, Number(limit) || 30));
  const [items, total] = await Promise.all([Product.find(filter).sort(sortMap[sort] || sortMap.featured).skip((safePage-1)*safeLimit).limit(safeLimit).lean(), Product.countDocuments(filter)]);
  res.json({ items: items.map(p => ({ ...p, id: p.productId })), page: safePage, limit: safeLimit, total });
 } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => { try { const p = await Product.findOne({ productId: req.params.id }).lean(); if (!p) return res.status(404).json({error:'Product not found.'}); res.json({...p,id:p.productId}); } catch(e){next(e);} });
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
 try { const p = await Product.create({ ...req.body, productId: String(req.body.productId || req.body.id || '').trim() }); await PricePoint.create({productId:p.productId,price:p.price}); res.status(201).json({...p.toObject(),id:p.productId}); } catch(e){next(e);}
});
router.patch('/:id', requireAuth, requireAdmin, async (req,res,next) => {
 try { const p=await Product.findOneAndUpdate({productId:req.params.id},{$set:req.body},{new:true,runValidators:true}); if(!p)return res.status(404).json({error:'Product not found.'}); if(req.body.price != null) await PricePoint.create({productId:p.productId,price:p.price}); res.json({...p.toObject(),id:p.productId}); }catch(e){next(e);}
});
router.delete('/:id', requireAuth, requireAdmin, async (req,res,next)=>{try{const p=await Product.findOneAndDelete({productId:req.params.id});if(!p)return res.status(404).json({error:'Product not found.'});res.status(204).end();}catch(e){next(e);}});
export default router;
