
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      throw new Error('Email and userId are required');
    }

    console.log('Creating Stripe customer for:', { email, userId });

    const customer = await stripe.customers.create({
      email,
      metadata: {
        user_id: userId,
      },
    });

    console.log('Stripe customer created:', customer.id);

    const response = { customerId: customer.id };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
