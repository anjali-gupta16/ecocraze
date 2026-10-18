import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Search,
  Package,
  Layers,
  Check,
} from 'lucide-react';
import { getProducts, saveProduct, deleteProduct } from '../../lib/store';
import type { Product, Category, BulkTier } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: Category;
    size: string;
    image_url: string;
    price: number;
    stock: number;
    active: boolean;
    bulk_pricing: BulkTier[];
  }>({
    name: '',
    description: '',
    category: 'paper-plates',
    size: '',
    image_url: '',
    price: 150,
    stock: 500,
    active: true,
    bulk_pricing: [
      { product_id: '', min_qty: 1, max_qty: 9, unit_price: 150 },
      { product_id: '', min_qty: 10, max_qty: 49, unit_price: 130 },
      { product_id: '', min_qty: 50, max_qty: null, unit_price: 115 },
    ],
  });

  const fetchProductList = () => {
    setLoading(true);
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'paper-plates',
      size: '10 Inch (Pack of 50)',
      image_url: '/paper-plates-collection.png',
      price: 150,
      stock: 500,
      active: true,
      bulk_pricing: [
        { product_id: '', min_qty: 1, max_qty: 9, unit_price: 150 },
        { product_id: '', min_qty: 10, max_qty: 49, unit_price: 130 },
        { product_id: '', min_qty: 50, max_qty: null, unit_price: 115 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      size: p.size,
      image_url: p.image_url,
      price: p.price,
      stock: p.stock,
      active: p.active,
      bulk_pricing: p.bulk_pricing || [
        { product_id: p.id, min_qty: 1, max_qty: 9, unit_price: p.price },
        { product_id: p.id, min_qty: 10, max_qty: 49, unit_price: Math.round(p.price * 0.88) },
        { product_id: p.id, min_qty: 50, max_qty: null, unit_price: Math.round(p.price * 0.78) },
      ],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await saveProduct({
      id: editingProduct?.id,
      ...formData,
    });

    setIsModalOpen(false);
    fetchProductList();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;
    await deleteProduct(id);
    fetchProductList();
  };

  const handleTierChange = (index: number, field: 'min_qty' | 'max_qty' | 'unit_price', value: any) => {
    const updated = [...formData.bulk_pricing];
    updated[index] = { ...updated[index], [field]: value === '' ? null : Number(value) };
    setFormData({ ...formData, bulk_pricing: updated });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.size.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesLowStock = !lowStockOnly || p.stock < 350;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockCount = products.filter((p) => p.stock < 350).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Products & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Maintain wholesale stock levels, bulk pricing tier matrices, and product catalog.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          className="font-bold shadow-md self-start sm:self-auto cursor-pointer"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Wholesale Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-text-light absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products by title or dimensions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="paper-plates">Paper Plates</option>
              <option value="dona-bowls">Dona Bowls</option>
              <option value="tissue-papers">Tissue Papers</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                lowStockOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-text-secondary border-border hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Low Stock Alerts ({lowStockCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20">
            <Spinner label="Loading warehouse inventory..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted">
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted font-semibold bg-slate-50/70">
                  <th className="py-3 px-4">Product & Specification</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base MRP</th>
                  <th className="py-3 px-4">Bulk Tiers</th>
                  <th className="py-3 px-4">Stock (Packets)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const isLow = p.stock < 350;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('plate-selection-sheet.png')) {
                                target.src = '/products/plate-selection-sheet.png';
                              }
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-text-primary truncate">{p.name}</p>
                            <p className="text-[11px] text-text-muted">{p.size}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize text-text-secondary font-medium">
                        {p.category.replace('-', ' ')}
                      </td>

                      <td className="py-3 px-4 font-bold text-text-primary">
                        ₹{p.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-primary-600" />
                          <span className="font-semibold text-text-secondary">
                            {p.bulk_pricing?.length || 3} tiers
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isLow ? 'text-amber-700' : 'text-text-primary'
                            }`}
                          >
                            {p.stock}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.active ? 'Active' : 'Archived'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'Edit Wholesale Product' : 'Add New Wholesale Product'}
          maxWidth="xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <Input
              label="Product Title"
              placeholder="e.g. 12-Inch Heavy Duty Silver Laminated Paper Plates"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full py-2.5 px-3 rounded-lg border border-border bg-white text-xs font-medium focus:ring-2 focus:ring-primary-500"
                >
                  <option value="paper-plates">Paper Plates</option>
                  <option value="dona-bowls">Dona Bowls</option>
                  <option value="tissue-papers">Tissue Papers</option>
                </select>
              </div>

              <Input
                label="Size / Pack Specification"
                placeholder="e.g. 12 Inch (Pack of 50)"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Base Rate (₹ / Packet)"
                type="number"
                min="1"
                step="0.5"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />

              <Input
                label="Available Warehouse Stock (Packets)"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>

            <Input
              label="Product Image URL (Unsplash or CDN)"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Description & Material Specifications
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border text-xs focus:ring-2 focus:ring-primary-500"
                placeholder="Product characteristics, GSM, leak-proofing..."
              />
            </div>

            {/* Bulk Tier Rates Config */}
            <div className="pt-2 border-t border-border">
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Wholesale Bulk Quantity Tiers
              </label>

              <div className="space-y-2">
                {formData.bulk_pricing.map((tier, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <span className="text-[11px] font-bold text-text-muted w-12">Tier {idx + 1}</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={tier.min_qty}
                      onChange={(e) => handleTierChange(idx, 'min_qty', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white text-xs font-bold text-center"
                    />
                    <span className="text-text-muted">to</span>
                    <input
                      type="number"
                      placeholder="Max (+ for null)"
                      value={tier.max_qty === null ? '' : tier.max_qty}
                      onChange={(e) => handleTierChange(idx, 'max_qty', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white text-xs font-bold text-center"
                    />
                    <span className="text-text-muted">pkts =</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="font-bold text-text-primary">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="Rate"
                        value={tier.unit_price}
                        onChange={(e) => handleTierChange(idx, 'unit_price', e.target.value)}
                        className="w-20 p-1.5 border rounded bg-white text-xs font-bold text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button onClick={() => setIsModalOpen(false)} variant="outline" size="sm" type="button">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="font-bold">
                Save Product
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
