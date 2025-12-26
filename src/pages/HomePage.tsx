import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, Star, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import { AnimatedSection, StaggerContainer, StaggerItem, CharacterReveal } from '@/components/animations/AnimatedSection';
import { Button, CTAButton } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mock data - replace with real data from Supabase
const heroSlides = [
  {
    id: 1,
    title: 'New Season Arrivals',
    subtitle: 'Discover the latest trends',
    cta: 'Shop Collection',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920',
  },
  {
    id: 2,
    title: 'Minimalist Essentials',
    subtitle: 'Timeless pieces for every wardrobe',
    cta: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920',
  },
  {
    id: 3,
    title: 'Street Style',
    subtitle: 'Urban fashion redefined',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920',
  },
];

const categories = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', count: 45 },
  { id: '2', name: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', count: 32 },
  { id: '3', name: 'Pants', slug: 'pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', count: 28 },
  { id: '4', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600', count: 64 },
];

const featuredProducts = [
  {
    id: '1',
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    description: 'Premium cotton t-shirt',
    short_description: 'Premium cotton',
    price: 49.00,
    compare_at_price: 65.00,
    sku: 'ECT-001',
    quantity: 100,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '1',
    category: { id: '1', name: 'T-Shirts', slug: 't-shirts', position: 1, is_active: true },
    tags: ['essential', 'cotton'],
    images: [{ id: '1', product_id: '1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt_text: 'Cotton Tee', position: 1, is_primary: true }],
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
    description: 'Classic denim jacket',
    short_description: 'Classic denim',
    price: 189.00,
    sku: 'UDJ-001',
    quantity: 50,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '2',
    category: { id: '2', name: 'Jackets', slug: 'jackets', position: 2, is_active: true },
    tags: ['denim', 'urban'],
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
    description: 'Comfortable slim fit chinos',
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
    name: 'Leather Belt',
    slug: 'leather-belt',
    description: 'Genuine leather belt',
    short_description: 'Genuine leather',
    price: 59.00,
    compare_at_price: 79.00,
    sku: 'LB-001',
    quantity: 120,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    category_id: '4',
    category: { id: '4', name: 'Accessories', slug: 'accessories', position: 4, is_active: true },
    tags: ['leather', 'accessory'],
    images: [{ id: '4', product_id: '4', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt_text: 'Leather Belt', position: 1, is_primary: true }],
    variants: [],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const benefits = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $100' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
];

const testimonials = [
  { id: 1, name: 'Sarah M.', rating: 5, text: 'Amazing quality and fast shipping. Will definitely order again!', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, name: 'James K.', rating: 5, text: 'The best fashion store I have found. Love the minimalist style.', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 3, name: 'Emily R.', rating: 5, text: 'Customer service was excellent. Helped me find the perfect outfit.', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
];

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.utils.toArray('.parallax-section').forEach((section: unknown) => {
        const element = section as HTMLElement;
        gsap.to(element, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen">
        <motion.div style={{ y }} className="absolute inset-0">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="h-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 flex items-center"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 bg-white/10 backdrop-blur text-white text-sm font-medium rounded-full mb-6"
              >
                New Collection 2025
              </motion.span>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                <CharacterReveal text="Redefine Your Style" delay={0.3} />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-gray-300 mb-8 max-w-lg"
              >
                Discover timeless pieces crafted with precision and attention to detail.
                Elevate your wardrobe with our premium collection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-4"
              >
                <CTAButton text="Shop Now" onClick={() => {}} />
                <Button variant="outline" leftIcon={<Play className="h-4 w-4" />}>
                  Watch Lookbook
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div className="w-1.5 h-3 bg-white rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Banner */}
      <section className="py-4 bg-white text-black overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-medium flex items-center gap-8">
              <span>FREE SHIPPING OVER $100</span>
              <Star className="h-4 w-4 fill-black" />
              <span>NEW ARRIVALS EVERY WEEK</span>
              <Star className="h-4 w-4 fill-black" />
              <span>30-DAY RETURNS</span>
              <Star className="h-4 w-4 fill-black" />
              <span>SECURE CHECKOUT</span>
              <Star className="h-4 w-4 fill-black" />
            </span>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeUp">
            <div className="text-center mb-16">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Browse by</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">Categories</h2>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <Link to={`/shop?category=${category.slug}`} className="group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary-900"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-gray-300 text-sm">{category.count} Products</p>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-primary-950">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <span className="text-sm text-gray-400 uppercase tracking-wider">Our Selection</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">Featured Products</h2>
              </div>
              <Link
                to="/shop"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <AnimatedSection
                key={product.id}
                animation="fadeUp"
                delay={index * 0.1}
              >
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Split Banner */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Banner */}
            <AnimatedSection animation="slideLeft">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800"
                  alt="Men's Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 flex items-center p-8">
                  <div>
                    <span className="text-sm text-gray-300 uppercase tracking-wider">New In</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Men's Collection</h3>
                    <Button variant="outline">Shop Men</Button>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Right Banner */}
            <AnimatedSection animation="slideRight">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                  alt="Women's Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 flex items-center p-8">
                  <div>
                    <span className="text-sm text-gray-300 uppercase tracking-wider">Trending</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Women's Collection</h3>
                    <Button variant="outline">Shop Women</Button>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary-950">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeUp">
            <div className="text-center mb-16">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">What Our Customers Say</h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.id} animation="fadeUp" delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-primary-900 rounded-2xl p-8 border border-primary-800"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="font-medium text-white">{testimonial.name}</span>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeUp">
            <div className="text-center mb-16">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Follow Us</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">@WalmerStore</h2>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StaggerItem key={i}>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="block aspect-square overflow-hidden rounded-lg bg-primary-900"
                >
                  <img
                    src={`https://picsum.photos/400/400?random=${i}`}
                    alt={`Instagram post ${i}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <AnimatedSection animation="scale">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join the WALMER Family
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be the first to know about new collections, exclusive offers, and style tips.
            </p>
            <CTAButton text="Subscribe Now" onClick={() => {}} />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
