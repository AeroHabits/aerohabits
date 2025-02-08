
import { loadStripe as _loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export const loadStripe = (publishableKey: string) => {
  if (!stripePromise) {
    stripePromise = _loadStripe(publishableKey);
  }
  return stripePromise;
};
