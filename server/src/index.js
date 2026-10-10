import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import insightRoutes from './routes/insights.js';

const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({origin:(process.env.CLIENT_ORIGIN||'http://localhost:5173').split(',').map(s=>s.trim()),methods:['GET','POST','PATCH','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
app.use(express.json({limit:'100kb'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:'draft-7',legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({ok:true,service:'electrocompare-api',database:mongoose.connection.readyState===1?'connected':'disconnected'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false}),authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/insights',insightRoutes);
app.use((req,res)=>res.status(404).json({error:'Route not found.'}));
app.use((err,req,res,next)=>{
 if(err?.name==='ZodError')return res.status(400).json({error:'Invalid request.',details:err.issues?.map(i=>({path:i.path.join('.'),message:i.message}))});
 if(err?.code===11000)return res.status(409).json({error:'A record with that identifier already exists.'});
 if(err?.name==='ValidationError')return res.status(400).json({error:'Validation failed.'});
 const status=Number(err.status)||500;
 if(status>=500)console.error(err);
 res.status(status).json({error:status>=500?(err.publicMessage||'Server error. Check server logs.'):err.message});
});
const port=Number(process.env.PORT)||5000;
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('JWT_SECRET must be configured with at least 32 characters.');process.exit(1);}
if(!process.env.MONGODB_URI){console.error('MONGODB_URI is required.');process.exit(1);}
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`ElectroCompare API listening on http://localhost:${port}`))).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1);});
