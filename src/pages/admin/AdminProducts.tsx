import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  Copy,
  Archive,
} from 'lucide-react';

import { Button, IconButton } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock data
const products = [
  {
    id: '1',
    name: 'Essential Cotton Tee',
    sku: 'ECT-001',
    category: 'T-Shirts',
    price: 49.00,
    comparePrice: 65.00,
    stock: 100,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100',
  },
  {
    id: '2',
    name: 'Urban Denim Jacket',
    sku: 'UDJ-001',
    category: 'Jackets',
    price: 189.00,
    comparePrice: null,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100',
  },
  {
    id: '3',
    name: 'Slim Fit Chinos',
    sku: 'SFC-001',
    category: 'Pants',
    price: 89.00,
    comparePrice: null,
    stock: 75,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100',
  },
  {
    id: '4',
    name: 'Premium Leather Belt',
    sku: 'PLB-001',
    category: 'Accessories',
    price: 59.00,
    comparePrice: 79.00,
    stock: 120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100',
  },
  {
    id: '5',
    name: 'Minimalist Watch',
    sku: 'MW-001',
    category: 'Accessories',
    price: 149.00,
    comparePrice: null,
    stock: 5,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100',
  },
  {
    id: '6',
    name: 'Wool Overcoat',
    sku: 'WO-001',
    category: 'Jackets',
    price: 299.00,
    comparePrice: null,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100',
  },
];

const categories = [
  { value: '', label: 'All Categories' },
  { value: 't-shirts', label: 'T-Shirts' },
  { value: 'jackets', label: 'Jackets' },
  { value: 'pants', label: 'Pants' },
  { value: 'accessories', label: 'Accessories' },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-500/20 text-green-400' },
  low_stock: { label: 'Low Stock', color: 'bg-yellow-500/20 text-yellow-400' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-500/20 text-red-400' },
  draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-400' },
};

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category.toLowerCase().replace(' ', '-') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete
    console.log('Deleting product:', selectedProduct?.id);
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsAddModalOpen(true)}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-primary-900 border border-primary-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-11 px-4 bg-primary-900 border border-primary-800 rounded-lg text-white focus:outline-none focus:border-white/30"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {products.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-400">
            {products.filter((p) => p.status === 'low_stock').length}
          </p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-400">
            {products.filter((p) => p.status === 'out_of_stock').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-primary-900 rounded-xl border border-primary-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-800">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-primary-800 last:border-0 hover:bg-primary-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-300">{product.category}</td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="text-white font-medium">{formatCurrency(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-gray-500 line-through text-sm ml-2">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      'font-medium',
                      product.stock === 0 ? 'text-red-400' :
                      product.stock <= 10 ? 'text-yellow-400' : 'text-white'
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                      statusConfig[product.status as keyof typeof statusConfig].color
                    )}>
                      {statusConfig[product.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton>
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      <IconButton>
                        <Edit className="h-4 w-4" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-primary-800">
          <p className="text-gray-400 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-2">
            <IconButton disabled>
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <span className="px-3 py-1 bg-white text-black rounded text-sm font-medium">1</span>
            <IconButton disabled>
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Product Name" placeholder="Essential Cotton Tee" />
            <Input label="SKU" placeholder="ECT-001" />
          </div>

          <Textarea label="Description" placeholder="Enter product description..." />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Price" type="number" placeholder="49.00" />
            <Input label="Compare at Price" type="number" placeholder="65.00" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories.filter((c) => c.value !== '')}
            />
            <Input label="Stock Quantity" type="number" placeholder="100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
            <div className="border-2 border-dashed border-primary-700 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Drag and drop images here, or click to browse</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
