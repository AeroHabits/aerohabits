
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

console.log('Initializing Stripe with key mode:', stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live');

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});
