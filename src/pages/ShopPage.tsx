import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { ProductCard, ProductGrid } from '@/components/ui/ProductCard';
import { Button, IconButton } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Input';
import { BottomSheet } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

// Mock data - replace with real data from Supabase
const allProducts: Product[] = [
  {
    id: '1',
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    description: 'Premium cotton t-shirt with a relaxed fit',
    short_description: 'Premium cotton',
    price: 49.00,
    compare_at_price: 65.00,
    sku: 'ECT-001',
    quantity: 100,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '1',
    category: { id: '1', name: 'T-Shirts', slug: 't-shirts', position: 1, is_active: true },
    tags: ['essential', 'cotton', 'new'],
    images: [
      { id: '1', product_id: '1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt_text: 'Cotton Tee', position: 1, is_primary: true },
      { id: '1b', product_id: '1', url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800', alt_text: 'Cotton Tee Back', position: 2, is_primary: false },
    ],
    variants: [],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Urban Denim Jacket',
    slug: 'urban-denim-jacket',
    description: 'Classic denim jacket with modern details',
    short_description: 'Classic denim',
    price: 189.00,
    sku: 'UDJ-001',
    quantity: 50,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '2',
    category: { id: '2', name: 'Jackets', slug: 'jackets', position: 2, is_active: true },
    tags: ['denim', 'urban', 'best-seller'],
    images: [{ id: '2', product_id: '2', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', alt_text: 'Denim Jacket', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Slim Fit Chinos',
    slug: 'slim-fit-chinos',
    description: 'Comfortable slim fit chinos for everyday wear',
    short_description: 'Slim fit design',
    price: 89.00,
    sku: 'SFC-001',
    quantity: 75,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '3',
    category: { id: '3', name: 'Pants', slug: 'pants', position: 3, is_active: true },
    tags: ['chinos', 'slim'],
    images: [{ id: '3', product_id: '3', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', alt_text: 'Chinos', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Premium Leather Belt',
    slug: 'premium-leather-belt',
    description: 'Genuine leather belt with brushed metal buckle',
    short_description: 'Genuine leather',
    price: 59.00,
    compare_at_price: 79.00,
    sku: 'PLB-001',
    quantity: 120,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '4',
    category: { id: '4', name: 'Accessories', slug: 'accessories', position: 4, is_active: true },
    tags: ['leather', 'accessory', 'sale'],
    images: [{ id: '4', product_id: '4', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt_text: 'Leather Belt', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Minimalist Watch',
    slug: 'minimalist-watch',
    description: 'Clean and simple watch design',
    short_description: 'Minimalist design',
    price: 149.00,
    sku: 'MW-001',
    quantity: 30,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '4',
    category: { id: '4', name: 'Accessories', slug: 'accessories', position: 4, is_active: true },
    tags: ['watch', 'minimalist', 'new'],
    images: [{ id: '5', product_id: '5', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', alt_text: 'Watch', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Wool Overcoat',
    slug: 'wool-overcoat',
    description: 'Elegant wool overcoat for winter',
    short_description: 'Premium wool',
    price: 299.00,
    sku: 'WO-001',
    quantity: 25,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '2',
    category: { id: '2', name: 'Jackets', slug: 'jackets', position: 2, is_active: true },
    tags: ['wool', 'winter', 'premium'],
    images: [{ id: '6', product_id: '6', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', alt_text: 'Overcoat', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Graphic Print Hoodie',
    slug: 'graphic-print-hoodie',
    description: 'Street style hoodie with unique graphics',
    short_description: 'Street style',
    price: 79.00,
    sku: 'GPH-001',
    quantity: 60,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '1',
    category: { id: '1', name: 'T-Shirts', slug: 't-shirts', position: 1, is_active: true },
    tags: ['hoodie', 'street', 'graphic'],
    images: [{ id: '7', product_id: '7', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', alt_text: 'Hoodie', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Canvas Sneakers',
    slug: 'canvas-sneakers',
    description: 'Classic canvas sneakers',
    short_description: 'Classic canvas',
    price: 69.00,
    compare_at_price: 89.00,
    sku: 'CS-001',
    quantity: 80,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '4',
    category: { id: '4', name: 'Accessories', slug: 'accessories', position: 4, is_active: true },
    tags: ['sneakers', 'canvas', 'sale'],
    images: [{ id: '8', product_id: '8', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', alt_text: 'Sneakers', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const categories = [
  { id: 'all', name: 'All', slug: 'all' },
  { id: '1', name: 'T-Shirts', slug: 't-shirts' },
  { id: '2', name: 'Jackets', slug: 'jackets' },
  { id: '3', name: 'Pants', slug: 'pants' },
  { id: '4', name: 'Accessories', slug: 'accessories' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200+', label: '$200+' },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<3 | 4>(4);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all');

  // Apply filters
  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    // Sort
    switch (selectedSort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setProducts(filtered);

    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSort !== 'newest') params.set('sort', selectedSort);
    if (selectedPrice !== 'all') params.set('price', selectedPrice);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedSort, selectedPrice, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSort('newest');
    setSelectedPrice('all');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedSort !== 'newest' || selectedPrice !== 'all';

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-black" />
        <div className="relative container mx-auto px-6 text-center">
          <AnimatedSection animation="fadeUp">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Shop All</h1>
            <p className="text-gray-400 text-lg">Discover our complete collection</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Top bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="w-full lg:w-80">
              <SearchInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile filter button */}
              <Button
                variant="outline"
                className="lg:hidden"
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setIsFilterOpen(true)}
              >
                Filters
              </Button>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="h-11 pl-4 pr-10 bg-primary-900 border border-primary-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Grid toggle */}
              <div className="hidden md:flex items-center gap-1 bg-primary-900 rounded-lg p-1">
                <IconButton
                  onClick={() => setGridView(3)}
                  className={cn(gridView === 3 && 'bg-white text-black')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={() => setGridView(4)}
                  className={cn(gridView === 4 && 'bg-white text-black')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </IconButton>
              </div>

              {/* Results count */}
              <span className="text-gray-400 text-sm hidden sm:inline">
                {products.length} products
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={cn(
                          'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                          selectedCategory === category.slug
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white hover:bg-primary-800'
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedPrice(range.value)}
                        className={cn(
                          'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                          selectedPrice === range.value
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white hover:bg-primary-800'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="w-full"
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {/* Active filters */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-800 text-white rounded-full text-sm">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-800 text-white rounded-full text-sm">
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory('all')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedPrice !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-800 text-white rounded-full text-sm">
                      {priceRanges.find((p) => p.value === selectedPrice)?.label}
                      <button onClick={() => setSelectedPrice('all')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </motion.div>
              )}

              {/* Products */}
              {products.length > 0 ? (
                <ProductGrid products={products} columns={gridView} />
              ) : (
                <div className="text-center py-20">
                  <SlidersHorizontal className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filters bottom sheet */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
      >
        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.slug);
                    setIsFilterOpen(false);
                  }}
                  className={cn(
                    'px-4 py-3 rounded-lg text-center transition-colors',
                    selectedCategory === category.slug
                      ? 'bg-white text-black'
                      : 'bg-primary-800 text-white'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-white font-semibold mb-4">Price Range</h3>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedPrice(range.value);
                    setIsFilterOpen(false);
                  }}
                  className={cn(
                    'px-4 py-3 rounded-lg text-center transition-colors',
                    selectedPrice === range.value
                      ? 'bg-white text-black'
                      : 'bg-primary-800 text-white'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
