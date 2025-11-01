import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment or use test key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51QRmZzGLCEqYmRpPjlTQGZ8RxZGMNQZmZQGZ8RxZGMNQZmZQGZ8RxZGMNQZmZ';

export const stripePromise = loadStripe(stripePublishableKey);
