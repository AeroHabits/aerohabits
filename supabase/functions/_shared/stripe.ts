
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 3, // Add retries for reliability
});

// CORS headers with Apple Pay domains included
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept, stripe-version, stripe-signature',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Helper to format error responses consistently
export const formatErrorResponse = (error: any, status = 400) => {
  console.error('Error:', error);
  
  const message = error?.message || 'An unknown error occurred';
  const code = error?.code || 'unknown_error';
  
  return new Response(
    JSON.stringify({ 
      error: { message, code },
      success: false
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      } 
    }
  );
};

// Safe JSON parser with error handling
export const safeParseJSON = async (req: Request) => {
  try {
    return await req.json();
  } catch (e) {
    throw new Error('Invalid JSON payload');
  }
};
