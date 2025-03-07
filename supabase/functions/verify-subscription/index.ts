
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing verify-subscription request");
    
    // Get the session ID from the request
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get user info from auth header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') || '';
    console.log("Auth header received:", authHeader ? "✓" : "✗");
    
    const { data, error } = await supabaseAdmin.auth.getUser(authHeader);
    const user = data?.user;
    
    if (error || !user) {
      console.error("Auth error:", error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Authenticated user:", user.id);
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['subscription'] }
    );
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify the session belongs to this user
    if (session.metadata?.userId !== user.id) {
      console.error("Session user ID mismatch", { 
        sessionUserId: session.metadata?.userId, 
        requestUserId: user.id 
      });
      
      return new Response(
        JSON.stringify({ error: "Unauthorized session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If session was successful, update the user's profile
    if (session.status === 'complete') {
      const subscription = session.subscription;
      
      if (subscription) {
        // Update profile with subscription details
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_subscribed: true,
            subscription_status: subscription.status,
            subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }
        
        return new Response(
          JSON.stringify({ 
            verified: true, 
            status: subscription.status,
            message: "Subscription verified successfully" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // If session wasn't successful or had no subscription
    return new Response(
      JSON.stringify({ 
        verified: false, 
        status: session.status,
        message: "Subscription verification failed" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying subscription:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
