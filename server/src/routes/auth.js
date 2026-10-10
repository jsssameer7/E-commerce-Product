import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const signupSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(10).max(128) });
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });
function tokenFor(user) { return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '2h', issuer: 'electrocompare-api', audience: 'electrocompare-client' }); }
function publicUser(user) { return { id: user._id.toString(), name: user.name, email: user.email, role: user.role }; }
router.post('/register', async (req, res, next) => {
 try {
  const input = signupSchema.parse(req.body);
  const email = input.email.toLowerCase();
  if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' });
  const user = await User.create({ name: input.name, email, passwordHash: await bcrypt.hash(input.password, 12), role: 'customer' });
  res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
 } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
 try {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
  res.json({ token: tokenFor(user), user: publicUser(user) });
 } catch (e) { next(e); }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
