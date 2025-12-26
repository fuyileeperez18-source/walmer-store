import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  Package,
  Shield,
  Check,
  Lock,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo');

// Form schemas
const shippingSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  saveInfo: z.boolean().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const steps = [
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'payment', name: 'Payment', icon: CreditCard },
  { id: 'confirmation', name: 'Confirmation', icon: Check },
];

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 10, days: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 25, days: '2-3 business days' },
  { id: 'overnight', name: 'Overnight Shipping', price: 50, days: '1 business day' },
];

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'ES', label: 'Spain' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CL', label: 'Chile' },
];

// Payment form component
function PaymentForm({
  onSuccess,
  onBack,
  total,
  isProcessing,
  setIsProcessing,
}: {
  onSuccess: (paymentId: string) => void;
  onBack: () => void;
  total: number;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // In production, create payment intent on your backend
      // For demo, we'll simulate a successful payment
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      onSuccess(paymentMethod?.id || 'demo_payment_id');
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Card Details
        </label>
        <div className="p-4 bg-primary-800 border border-primary-700 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#6b7280',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6"
        >
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
        <Shield className="h-5 w-5 text-green-500" />
        <p className="text-green-400 text-sm">
          Your payment is secured with 256-bit SSL encryption
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={isProcessing}
          disabled={!stripe || isProcessing}
          leftIcon={<Lock className="h-4 w-4" />}
        >
          Pay {formatCurrency(total)}
        </Button>
      </div>
    </form>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const subtotal = getSubtotal();
  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost = subtotal >= 100 ? 0 : (selectedShipping?.price || 10);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'US',
    },
  });

  // Pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('email', user.email || '');
    }
  }, [isAuthenticated, user, setValue]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep !== 2) {
      navigate('/shop');
    }
  }, [items, currentStep, navigate]);

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(1);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    setCurrentStep(2);
    clearCart();

    // TODO: Save order to Supabase
    // orderService.create({...})

    toast.success('Payment successful!');
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-bold text-white">
            WALMER
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </div>
        </div>

        {/* Progress steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <motion.div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      index <= currentStep
                        ? 'bg-white text-black'
                        : 'bg-primary-800 text-gray-400'
                    )}
                    animate={{
                      scale: index === currentStep ? 1.1 : 1,
                    }}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      'ml-3 text-sm font-medium hidden sm:block',
                      index <= currentStep ? 'text-white' : 'text-gray-400'
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-16 sm:w-24 h-0.5 mx-4',
                      index < currentStep ? 'bg-white' : 'bg-primary-800'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Shipping Information
                  </h2>

                  <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-6">
                    {/* Contact */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Contact</h3>
                      <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        leftIcon={<Mail className="h-5 w-5" />}
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>

                    {/* Name */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        placeholder="John"
                        leftIcon={<User className="h-5 w-5" />}
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>

                    {/* Phone */}
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      leftIcon={<Phone className="h-5 w-5" />}
                      error={errors.phone?.message}
                      {...register('phone')}
                    />

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 mt-8">
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <Input
                          label="Address"
                          placeholder="123 Main Street"
                          leftIcon={<MapPin className="h-5 w-5" />}
                          error={errors.address?.message}
                          {...register('address')}
                        />
                        <Input
                          label="Apartment, suite, etc. (optional)"
                          placeholder="Apt 4B"
                          leftIcon={<Building className="h-5 w-5" />}
                          {...register('apartment')}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            label="City"
                            placeholder="New York"
                            error={errors.city?.message}
                            {...register('city')}
                          />
                          <Input
                            label="State / Province"
                            placeholder="NY"
                            error={errors.state?.message}
                            {...register('state')}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            label="Postal Code"
                            placeholder="10001"
                            error={errors.postalCode?.message}
                            {...register('postalCode')}
                          />
                          <Select
                            label="Country"
                            options={countries}
                            error={errors.country?.message}
                            {...register('country')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping method */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 mt-8">
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        {shippingMethods.map((method) => (
                          <label
                            key={method.id}
                            className={cn(
                              'flex items-center justify-between p-4 bg-primary-900 rounded-lg cursor-pointer border-2 transition-colors',
                              shippingMethod === method.id
                                ? 'border-white'
                                : 'border-transparent hover:border-primary-700'
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={method.id}
                                checked={shippingMethod === method.id}
                                onChange={() => setShippingMethod(method.id)}
                                className="sr-only"
                              />
                              <div
                                className={cn(
                                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                  shippingMethod === method.id
                                    ? 'border-white bg-white'
                                    : 'border-gray-500'
                                )}
                              >
                                {shippingMethod === method.id && (
                                  <div className="w-2 h-2 rounded-full bg-black" />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">{method.name}</p>
                                <p className="text-gray-400 text-sm">{method.days}</p>
                              </div>
                            </div>
                            <span className="text-white font-medium">
                              {subtotal >= 100 && method.id === 'standard'
                                ? 'FREE'
                                : formatCurrency(method.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                      {subtotal < 100 && (
                        <p className="text-sm text-gray-400 mt-2">
                          Add {formatCurrency(100 - subtotal)} more for free standard shipping
                        </p>
                      )}
                    </div>

                    {/* Save info checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-primary-700 bg-primary-900 text-white focus:ring-white"
                        {...register('saveInfo')}
                      />
                      <span className="text-gray-300">
                        Save this information for next time
                      </span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate('/cart')}
                        leftIcon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Back to Cart
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Payment</h2>

                  {/* Shipping summary */}
                  {shippingData && (
                    <div className="p-4 bg-primary-900 rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Shipping to:</span>
                        <button
                          onClick={() => setCurrentStep(0)}
                          className="text-sm text-white hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-white">
                        {shippingData.firstName} {shippingData.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {shippingData.address}
                        {shippingData.apartment && `, ${shippingData.apartment}`}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                      </p>
                    </div>
                  )}

                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      onBack={() => setCurrentStep(0)}
                      total={total}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  </Elements>

                  {/* Payment methods icons */}
                  <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-primary-800">
                    <span className="text-gray-500 text-sm">We accept:</span>
                    {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                      <div
                        key={method}
                        className="px-3 py-1 bg-primary-800 rounded text-xs text-gray-400"
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 2 && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <Check className="h-12 w-12 text-white" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white mb-4">
                    Thank you for your order!
                  </h2>
                  <p className="text-gray-400 mb-2">
                    Your order has been confirmed and will be shipped soon.
                  </p>
                  <p className="text-white font-medium mb-8">
                    Order Number: <span className="text-green-400">{orderNumber}</span>
                  </p>

                  <div className="p-6 bg-primary-900 rounded-xl text-left mb-8 max-w-md mx-auto">
                    <h3 className="font-medium text-white mb-4">What's next?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">
                          You'll receive an email confirmation at {shippingData?.email}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">
                          We'll send you shipping updates via email and WhatsApp
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">
                          Estimated delivery: {selectedShipping?.days}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate('/account/orders')}>
                      View Order
                    </Button>
                    <Button onClick={() => navigate('/shop')}>
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          {currentStep < 2 && (
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-primary-900 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-primary-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.product.images?.[0]?.url ||
                            'https://via.placeholder.com/64x80/1a1a1a/ffffff?text=WALMER'
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.product.name}</p>
                        {item.variant && (
                          <p className="text-gray-400 text-sm">
                            {item.variant.options.map((o) => o.value).join(' / ')}
                          </p>
                        )}
                        <p className="text-white font-medium mt-1">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 h-11 px-4 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-primary-800">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-white pt-3 border-t border-primary-800">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
