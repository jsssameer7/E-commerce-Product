import React, { useState } from 'react';
import { Product, CategoryType } from '../types';
import { X, ShieldAlert, Plus, Package, DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateStock,
}) => {
  const [showAddForm, setShowAddForm] = useState(true);
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

  if (!isOpen) return null;

  const totalCatalogValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold">Seller & Product Inventory Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Top Bar */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 text-xs">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-gray-400 font-semibold">Total Active Products</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{products.length}</p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-gray-400 font-semibold">Inventory Valuation</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(totalCatalogValue)}</p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-gray-400 font-semibold">Spec Engine Matrix</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">Active</p>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Product Catalog Management</h3>
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
              <div className="grid grid-cols-3 gap-3">
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
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
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

              <div className="grid grid-cols-3 gap-3">
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
                  <th className="py-2">Item</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">In Stock</th>
                  <th className="py-2">Customer Status</th>
                  <th className="py-2 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="py-2 flex items-center gap-2">
                      <img src={p.image} alt="" className="w-8 h-8 object-contain rounded bg-white" />
                      <span className="font-bold text-gray-900 dark:text-white">{p.name}</span>
                    </td>
                    <td className="py-2 capitalize text-gray-500">{p.category}</td>
                    <td className="py-2 font-mono font-bold text-blue-600">{formatPrice(p.price)}</td>
                    <td className="py-2 font-bold text-gray-800 dark:text-gray-200">{p.stock} units</td>
                    <td className="py-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live for Customers
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 5))}
                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-bold"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => onUpdateStock(p.id, p.stock + 10)}
                          className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold"
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

      </div>
    </div>
  );
};

