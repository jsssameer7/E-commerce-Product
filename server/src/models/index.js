import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, index: true, required: true },
  name: { type: String, required: true, trim: true },
  brand: String, category: String, price: { type: Number, min: 0, required: true },
  originalPrice: { type: Number, min: 0, default: 0 }, rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 }, image: String, images: [String], badge: String,
  stock: { type: Number, min: 0, default: 0 }, specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  highlights: [String], description: String, pros: [String], cons: [String], releaseDate: String,
  performanceScore: Number, featuresScore: Number, valueScore: Number, recommendedUseCases: [String],
  sellerDeals: [mongoose.Schema.Types.Mixed]
}, { timestamps: true, strict: false });
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{ productId: String, name: String, image: String, unitPrice: Number, quantity: Number }],
  subtotal: Number, discount: { type: Number, default: 0 }, tax: Number, shipping: Number, total: Number,
  shippingAddress: { fullName: String, email: String, address: String, city: String, state: String, zipCode: String, country: String },
  paymentMethod: { type: String, default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  status: { type: String, enum: ['Processing','Shipped','Out for Delivery','Delivered','Cancelled','Refunded'], default: 'Processing' },
  razorpayOrderId: String, razorpayPaymentId: String, trackingNumber: String, estimatedDelivery: Date
}, { timestamps: true });

const pricePointSchema = new mongoose.Schema({ productId: { type: String, index: true }, price: Number, recordedAt: { type: Date, default: Date.now } });
const priceAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: String, targetPrice: { type: Number, min: 1 }, active: { type: Boolean, default: true }
}, { timestamps: true });
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const PricePoint = mongoose.models.PricePoint || mongoose.model('PricePoint', pricePointSchema);
export const PriceAlert = mongoose.models.PriceAlert || mongoose.model('PriceAlert', priceAlertSchema);
