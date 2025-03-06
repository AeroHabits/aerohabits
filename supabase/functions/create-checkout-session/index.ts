
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { stripe } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseKey);

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

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing checkout session request");
    const { priceId, returnUrl, includeTrialPeriod = true } = await req.json();
    
    // Verify these parameters exist
    if (!priceId || !returnUrl) {
      console.error("Missing required parameters:", { priceId, returnUrl });
      return new Response(
        JSON.stringify({ error: "Price ID and return URL are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get the user from the request
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      console.error("Missing authentication header");
      return new Response(
        JSON.stringify({ error: "Missing authentication header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get user information from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      console.error("Invalid user token:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid user token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    console.log("Fetching user profile for:", user.id);
    // Get user's profile to check subscription status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, subscription_status, is_subscribed")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Error fetching user profile" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If user already has an active subscription, redirect to customer portal instead
    if (profile.is_subscribed || profile.subscription_status === 'active') {
      console.log("User has active subscription, redirecting to portal");
      try {
        // Create customer portal session with retry
        const portalSession = await retryStripeOperation(() => 
          stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: returnUrl,
          })
        );

        return new Response(
          JSON.stringify({ url: portalSession.url }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error creating portal session:", error);
        throw error; // Let the outer catch handle this
      }
    }

    // Get or create customer
    let customerId = profile.stripe_customer_id;
    
    if (!customerId) {
      console.log("Creating new Stripe customer for user:", user.id);
      try {
        // Create a new customer with retry
        const customer = await retryStripeOperation(() => 
          stripe.customers.create({
            email: user.email,
            metadata: {
              supabaseUUID: user.id,
            },
          })
        );
        
        customerId = customer.id;
        
        // Update the user's profile with the new Stripe customer ID
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
          
        console.log(`Created new customer: ${customerId} for user: ${user.id}`);
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        throw error; // Let the outer catch handle this
      }
    } else {
      console.log(`Using existing customer: ${customerId} for user: ${user.id}`);
    }

    // Set up subscription details with or without trial
    const subscriptionData: any = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      payment_method_collection: 'always', // Always collect payment method even during trial
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
        trial_period_days: includeTrialPeriod ? 3 : 0 // Default to 3-day trial
      }
    };

    console.log("Creating checkout session with data:", {
      customer: customerId,
      includeTrialPeriod,
      returnUrl,
    });

    // Create a checkout session with retry
    const session = await retryStripeOperation(() => 
      stripe.checkout.sessions.create(subscriptionData)
    );

    console.log("Checkout session created successfully:", session.id);
    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
