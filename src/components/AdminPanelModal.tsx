import React, { useState } from 'react';
import { Product, CategoryType, Order } from '../types';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  MapPin, 
  AlertCircle,
  Tag,
  Save,
  Navigation
} from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  orders?: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status'], newTrackingNumber?: string, newEstimatedDelivery?: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateStock,
  orders = [],
  onUpdateOrderStatus,
}) => {
  // Navigation tabs: 'catalog' vs 'orders'
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('orders');

  // Product Catalog State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<CategoryType>('smartphones');
  const [newProductPrice, setNewProductPrice] = useState(24999);
  const [newProductImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  const [newProductDisplay, setNewProductDisplay] = useState('6.7" OLED 120Hz');
  const [newProductProcessor, setNewProductProcessor] = useState('Octa-Core Chip');
  const [newProductRam, setNewProductRam] = useState('8 GB');
  const [newProductStorage, setNewProductStorage] = useState('256 GB');
  const [newProductDescription, setNewProductDescription] = useState('High performance electronic device with cutting edge features.');

  // Order Delivery Management State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');

  if (!isOpen) return null;

  const totalCatalogValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Order Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const outForDeliveryCount = orders.filter((o) => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductBrand) return;

    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProductName,
      brand: newProductBrand,
      category: newProductCategory,
      price: Number(newProductPrice),
      originalPrice: Number(newProductPrice) * 1.15,
      rating: 4.8,
      reviewCount: 1,
      image: newProductImage,
      images: [newProductImage],
      badge: 'New Release',
      stock: 25,
      specs: {
        display: newProductDisplay,
        processor: newProductProcessor,
        ram: newProductRam,
        storage: newProductStorage,
        warranty: '1 Year Manufacturer Warranty',
      },
      highlights: ['Newly added seller item', 'Full technical spec sheet verified'],
      description: newProductDescription,
      pros: ['Great performance', 'Modern design'],
      cons: ['New release'],
      releaseDate: new Date().toISOString().split('T')[0],
      performanceScore: 9.0,
      featuresScore: 9.0,
      valueScore: 9.2,
      recommendedUseCases: ['Daily Driver', 'General Use']
    };

    onAddProduct(created);
    setShowAddForm(false);
    setNewProductName('');
    setNewProductBrand('');
  };

  // Filtered orders for delivery management
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      order.id.toLowerCase().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(q)) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q)) ||
      (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(q)) ||
      (order.shippingAddress?.zipCode && order.shippingAddress.zipCode.includes(q));

    return matchesFilter && matchesSearch;
  });

  const handleStartEditTracking = (order: Order) => {
    setEditingTrackingId(order.id);
    setTrackingNumberInput(order.trackingNumber || '');
    setEstimatedDeliveryInput(order.estimatedDelivery || '');
  };

  const handleSaveTracking = (orderId: string, currentStatus: Order['status']) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, currentStatus, trackingNumberInput, estimatedDeliveryInput);
    }
    setEditingTrackingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                Seller Control Center
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Seller Admin Mode
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">Manage customer order deliveries, dispatch shipments & update stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-50 dark:bg-gray-800/60 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Order Deliveries & Status Management</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Stock</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-black">
              {products.length}
            </span>
          </button>
        </div>

        {/* TAB 1: ORDER DELIVERIES & STATUS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Delivery KPI Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-blue-500" /> Total Orders
                </span>
                <p className="text-xl font-black text-gray-900 dark:text-white">{orders.length}</p>
                <p className="text-[10px] text-gray-500">Gross: {formatPrice(totalRevenue)}</p>
              </div>

              <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-1">
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Processing
                </span>
                <p className="text-xl font-black text-amber-900 dark:text-amber-200">{processingCount}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400">Needs Packing</p>
              </div>

              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-500" /> Shipped
                </span>
                <p className="text-xl font-black text-blue-900 dark:text-blue-200">{shippedCount}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400">With Courier</p>
              </div>

              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-1">
                <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-indigo-500" /> Out for Delivery
                </span>
                <p className="text-xl font-black text-indigo-900 dark:text-indigo-200">{outForDeliveryCount}</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Delivering Today</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Delivered
                </span>
                <p className="text-xl font-black text-emerald-900 dark:text-emerald-200">{deliveredCount}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Completed</p>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Email, Tracking AWB or City..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {(['all', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-200 dark:border-gray-800">
                <Truck className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Orders Found</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  No orders match your filter criteria. When customer purchases are made, they will populate here for delivery fulfillment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isEditingTracking = editingTrackingId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4 transition-all"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                            {order.id}
                          </span>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">
                              {order.customerName || 'Customer Shopper'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">{order.userEmail} • Placed on {order.date}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                                : order.status === 'Out for Delivery'
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 animate-pulse'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                            }`}
                          >
                            {order.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {order.status === 'Out for Delivery' && <Navigation className="w-3.5 h-3.5" />}
                            {order.status === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                            {order.status === 'Processing' && <Clock className="w-3.5 h-3.5" />}
                            {order.status === 'Cancelled' && <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{order.status}</span>
                          </span>
                          <span className="font-mono text-sm font-black text-gray-900 dark:text-white ml-2">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Shipping Address & Order Items */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        
                        {/* Address Column */}
                        <div className="md:col-span-5 p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                          <p className="font-bold text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Delivery Address
                          </p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {order.shippingAddress?.fullName || order.customerName}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.zipCode}</strong>
                          </p>
                          <div className="pt-1 flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="font-semibold">Payment:</span>
                            <span className="font-mono font-bold text-gray-700 dark:text-gray-300 uppercase">{order.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="md:col-span-7 p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <p className="font-bold text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-indigo-600" /> Items in Shipment ({order.items.length})
                          </p>
                          <div className="space-y-1.5 max-h-24 overflow-y-auto">
                            {order.items.map(({ product, quantity }) => (
                              <div key={product.id} className="flex items-center justify-between text-xs py-0.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img src={product.image} alt="" className="w-6 h-6 object-contain rounded bg-white p-0.5" />
                                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                                    {product.name}
                                  </span>
                                  <span className="text-gray-400">×{quantity}</span>
                                </div>
                                <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
                                  {formatPrice(product.price * quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Bottom Row: SELLER DELIVERY RIGHTS & STATUS CHANGER */}
                      <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                        
                        {/* Courier Tracking Status */}
                        <div className="flex-1">
                          {isEditingTracking ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                placeholder="AWB Tracking Number..."
                                value={trackingNumberInput}
                                onChange={(e) => setTrackingNumberInput(e.target.value)}
                                className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-indigo-300 rounded-lg text-xs font-mono"
                              />
                              <input
                                type="text"
                                placeholder="Estimated Delivery Note..."
                                value={estimatedDeliveryInput}
                                onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                                className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-indigo-300 rounded-lg text-xs"
                              />
                              <button
                                onClick={() => handleSaveTracking(order.id, order.status)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                              >
                                <Save className="w-3.5 h-3.5" /> Save
                              </button>
                              <button
                                onClick={() => setEditingTrackingId(null)}
                                className="px-2 py-1.5 text-gray-500 hover:text-gray-800 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-indigo-900 dark:text-indigo-200">
                                AWB Tracking:
                              </span>
                              <span className="font-mono font-bold bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 text-blue-600 dark:text-blue-400">
                                {order.trackingNumber || 'Pending Courier'}
                              </span>
                              <span className="text-gray-500 font-semibold">
                                • Delivery: {order.estimatedDelivery || 'To be confirmed'}
                              </span>
                              <button
                                onClick={() => handleStartEditTracking(order)}
                                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                              >
                                Edit Tracking
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Status Modifier Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
                            Modify Delivery Status:
                          </label>

                          {/* Quick Dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) => {
                              if (onUpdateOrderStatus) {
                                onUpdateOrderStatus(order.id, e.target.value as Order['status']);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-white dark:bg-gray-900 text-xs font-bold text-gray-900 dark:text-white rounded-xl border border-indigo-300 dark:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          >
                            <option value="Processing">🟡 Processing (Packing)</option>
                            <option value="Shipped">🔵 Shipped (In Transit)</option>
                            <option value="Out for Delivery">🟣 Out for Delivery</option>
                            <option value="Delivered">🟢 Delivered (Done)</option>
                            <option value="Cancelled">🔴 Cancelled & Refunded</option>
                          </select>

                          {/* 1-Click Status Accelerator Buttons */}
                          {order.status === 'Processing' && (
                            <button
                              onClick={() => onUpdateOrderStatus?.(order.id, 'Shipped')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95"
                              title="Advance to Shipped"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Ship Order</span>
                            </button>
                          )}

                          {order.status === 'Shipped' && (
                            <button
                              onClick={() => onUpdateOrderStatus?.(order.id, 'Out for Delivery')}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95"
                              title="Advance to Out for Delivery"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Out for Delivery</span>
                            </button>
                          )}

                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => onUpdateOrderStatus?.(order.id, 'Delivered')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95"
                              title="Mark as Delivered"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Delivered</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Analytics Top Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-gray-400 font-semibold text-xs">Total Active Products</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{products.length}</p>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-gray-400 font-semibold text-xs">Inventory Valuation</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(totalCatalogValue)}</p>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-gray-400 font-semibold text-xs">Spec Engine Matrix</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">Live & Synchronized</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Product Inventory & Stock Management</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? 'Cancel Form' : 'Add New Electronic Item'}</span>
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <form onSubmit={handleCreateProduct} className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">New Product Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Product Title"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Brand (e.g. Sony, Apple)"
                    required
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white capitalize"
                  >
                    <option value="smartphones">smartphones</option>
                    <option value="laptops">laptops</option>
                    <option value="audio">audio</option>
                    <option value="wearables">wearables</option>
                    <option value="gaming">gaming</option>
                    <option value="cameras">cameras</option>
                    <option value="tv">tv</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Display Spec"
                    value={newProductDisplay}
                    onChange={(e) => setNewProductDisplay(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Processor Spec"
                    value={newProductProcessor}
                    onChange={(e) => setNewProductProcessor(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="RAM Spec (e.g. 12 GB)"
                    value={newProductRam}
                    onChange={(e) => setNewProductRam(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Storage Spec (e.g. 512 GB)"
                    value={newProductStorage}
                    onChange={(e) => setNewProductStorage(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Save Product to Live Catalog
                </button>
              </form>
            )}

            {/* Product Stock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold uppercase">
                    <th className="py-2.5">Item</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Price</th>
                    <th className="py-2.5">In Stock</th>
                    <th className="py-2.5">Customer Status</th>
                    <th className="py-2.5 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      <td className="py-2.5 flex items-center gap-2">
                        <img src={p.image} alt="" className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                        <span className="font-bold text-gray-900 dark:text-white">{p.name}</span>
                      </td>
                      <td className="py-2.5 capitalize text-gray-500">{p.category}</td>
                      <td className="py-2.5 font-mono font-bold text-blue-600">{formatPrice(p.price)}</td>
                      <td className="py-2.5 font-bold text-gray-800 dark:text-gray-200">{p.stock} units</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live for Customers
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 5))}
                            className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-300"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => onUpdateStock(p.id, p.stock + 10)}
                            className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
