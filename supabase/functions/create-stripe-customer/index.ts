
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      throw new Error('Email and userId are required');
    }

    // First check if customer already exists
    const { data: customers } = await stripe.customers.search({
      query: `metadata['user_id']:'${userId}'`,
    });

    let customer;
    
    if (customers && customers.length > 0) {
      // Use existing customer
      customer = customers[0];
      console.log('Using existing Stripe customer:', customer.id);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email,
        metadata: {
          user_id: userId,
        },
      });
      console.log('Created new Stripe customer:', customer.id);
    }

    const response = { customerId: customer.id };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-stripe-customer:', error);
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        } 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
