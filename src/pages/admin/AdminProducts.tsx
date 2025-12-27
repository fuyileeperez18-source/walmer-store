import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button, IconButton } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import type { UploadedImage } from '@/components/ui/ImageUpload';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock data
const products = [
  {
    id: '1',
    name: 'Camiseta Algodón Premium',
    sku: 'CAP-001',
    category: 'Camisetas',
    gender: 'hombre',
    price: 89000,
    comparePrice: 120000,
    stock: 100,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100',
  },
  {
    id: '2',
    name: 'Chaqueta Denim Urbana',
    sku: 'CDU-001',
    category: 'Chaquetas',
    gender: 'unisex',
    price: 350000,
    comparePrice: null,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100',
  },
  {
    id: '3',
    name: 'Pantalón Chino Slim',
    sku: 'PCS-001',
    category: 'Pantalones',
    gender: 'hombre',
    price: 180000,
    comparePrice: null,
    stock: 75,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100',
  },
  {
    id: '4',
    name: 'Cinturón de Cuero',
    sku: 'CDC-001',
    category: 'Accesorios',
    gender: 'unisex',
    price: 95000,
    comparePrice: 130000,
    stock: 120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100',
  },
  {
    id: '5',
    name: 'Reloj Minimalista',
    sku: 'RM-001',
    category: 'Accesorios',
    gender: 'unisex',
    price: 250000,
    comparePrice: null,
    stock: 5,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100',
  },
  {
    id: '6',
    name: 'Abrigo de Lana',
    sku: 'AL-001',
    category: 'Chaquetas',
    gender: 'mujer',
    price: 450000,
    comparePrice: null,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100',
  },
  {
    id: '7',
    name: 'Camisa Formal Blanca',
    sku: 'CFB-001',
    category: 'Camisas',
    gender: 'hombre',
    price: 150000,
    comparePrice: null,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100',
  },
  {
    id: '8',
    name: 'Sudadera con Capucha',
    sku: 'SC-001',
    category: 'Sudaderas',
    gender: 'unisex',
    price: 180000,
    comparePrice: 220000,
    stock: 60,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100',
  },
];

const categories = [
  { value: '', label: 'Todas las Categorías' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'camisas', label: 'Camisas' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'chaquetas', label: 'Chaquetas' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'sudaderas', label: 'Sudaderas' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'zapatos', label: 'Zapatos' },
];

const genderOptions = [
  { value: '', label: 'Todos los Géneros' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' },
];

const sizeOptions = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

const statusConfig = {
  active: { label: 'Activo', color: 'bg-green-500/20 text-green-400' },
  low_stock: { label: 'Bajo Stock', color: 'bg-yellow-500/20 text-yellow-400' },
  out_of_stock: { label: 'Sin Stock', color: 'bg-red-500/20 text-red-400' },
  draft: { label: 'Borrador', color: 'bg-gray-500/20 text-gray-400' },
};

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [productImages, setProductImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    gender: '',
    stock: '',
    colors: '',
    sizes: [] as string[],
    isFeatured: false,
    isActive: true,
  });

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

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      comparePrice: '',
      category: '',
      gender: '',
      stock: '',
      colors: '',
      sizes: [],
      isFeatured: false,
      isActive: true,
    });
    setProductImages([]);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    if (productImages.length === 0) {
      toast.error('Por favor sube al menos una imagen');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Enviar datos al backend
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock) || 0,
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: productImages.map((img) => ({
          url: img.url,
          alt_text: img.alt_text,
          position: img.position,
          is_primary: img.is_primary,
        })),
      };

      console.log('Product data:', productData);
      toast.success('Producto agregado correctamente');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error al crear el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-gray-400">Gestiona tu catálogo de productos</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsAddModalOpen(true)}>
          Agregar Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
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
          <p className="text-gray-400 text-sm">Total Productos</p>
          <p className="text-2xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Activos</p>
          <p className="text-2xl font-bold text-green-400">
            {products.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Bajo Stock</p>
          <p className="text-2xl font-bold text-yellow-400">
            {products.filter((p) => p.status === 'low_stock').length}
          </p>
        </div>
        <div className="bg-primary-900 rounded-xl p-4 border border-primary-800">
          <p className="text-gray-400 text-sm">Sin Stock</p>
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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Producto</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Categoría</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Estado</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Acciones</th>
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
            Mostrando {filteredProducts.length} de {products.length} productos
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
        onClose={handleCloseModal}
        title="Agregar Nuevo Producto"
        size="lg"
      >
        <form onSubmit={handleSubmitProduct} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Nombre del Producto *"
              placeholder="Camiseta Algodón Premium"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <Input
              label="SKU"
              placeholder="CAP-001"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
            />
          </div>

          <Textarea
            label="Descripción"
            placeholder="Ingresa la descripción del producto..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Precio (COP) *"
              type="number"
              placeholder="89000"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
            />
            <Input
              label="Precio Comparado (COP)"
              type="number"
              placeholder="120000"
              value={formData.comparePrice}
              onChange={(e) => handleInputChange('comparePrice', e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Select
              label="Categoría *"
              options={categories.filter((c) => c.value !== '')}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <Select
              label="Género"
              options={genderOptions.filter((g) => g.value !== '')}
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            />
            <Input
              label="Stock"
              type="number"
              placeholder="100"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tallas Disponibles</label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <label
                  key={size.value}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                    formData.sizes.includes(size.value)
                      ? 'bg-white text-black'
                      : 'bg-primary-800 hover:bg-primary-700'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size.value)}
                    onChange={() => handleSizeToggle(size.value)}
                    className="sr-only"
                  />
                  <span className={cn(
                    'text-sm font-medium',
                    formData.sizes.includes(size.value) ? 'text-black' : 'text-white'
                  )}>
                    {size.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Colores</label>
            <Input
              placeholder="Ej: Negro, Blanco, Gris (separados por coma)"
              value={formData.colors}
              onChange={(e) => handleInputChange('colors', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Imágenes del Producto *</label>
            <ImageUpload
              images={productImages}
              onChange={setProductImages}
              maxImages={10}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded border-primary-700 bg-primary-900 text-white"
              />
              <span className="text-gray-300 text-sm">Producto destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 rounded border-primary-700 bg-primary-900 text-white"
              />
              <span className="text-gray-300 text-sm">Producto activo</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              Agregar Producto
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
