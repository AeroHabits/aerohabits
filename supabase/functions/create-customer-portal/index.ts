
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { stripe } from "../_shared/stripe.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to implement retry logic for Stripe API calls
async function retryStripeOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      lastError = error;
      
      // Only retry on network errors or 5xx responses
      if (!error.message.includes('network') && !error.message.includes('502') && !error.message.includes('503')) {
        throw error; // Don't retry on client errors
      }
      
      // Exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.min(100 * Math.pow(2, attempt), 2000); // Max 2 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Processing customer portal request");
    const { returnUrl } = await req.json()

    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    console.log("Auth header received:", authHeader ? "✓" : "✗");
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader);

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("Authenticated user:", user.id);
    // Get user's stripe_customer_id from profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }
      
    if (!profile?.stripe_customer_id) {
      console.error("No customer ID found for user:", user.id);
      return new Response(
        JSON.stringify({ error: 'No subscription found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("Creating portal session for customer:", profile.stripe_customer_id);
    // Create customer portal session with retry
    const session = await retryStripeOperation(() => 
      stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: returnUrl,
      })
    );

    console.log("Portal session created successfully:", session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating customer portal:', error);
    
    // More detailed error information
    const errorDetails = {
      message: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown',
      stack: error.stack?.split('\n').slice(0, 3).join('\n') || 'Not available'
    };
    console.error("Error details:", JSON.stringify(errorDetails));
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: errorDetails 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
