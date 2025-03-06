
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno';

// Configure Stripe with better network settings
export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 3, // Enable built-in retries for idempotent requests
  timeout: 30000, // Increase timeout to 30 seconds
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
