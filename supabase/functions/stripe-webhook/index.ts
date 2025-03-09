
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  handleSubscriptionCreated, 
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleCheckoutComplete,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleTrialWillEnd
} from "../_shared/webhookHandlers.ts";

serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Verify signature
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No signature provided");
      return new Response(JSON.stringify({ error: "No signature provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Event type: ${event.type}`);

    // Process different Stripe webhook events without using process.nextTick() or similar methods
    // that might cause the Deno.core.runMicrotasks() error
    switch (event.type) {
      case "customer.subscription.created":
        try {
          await handleSubscriptionCreated(event.data.object);
        } catch (error) {
          console.error(`Error in subscription created handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "customer.subscription.updated":
        try {
          await handleSubscriptionUpdated(event.data.object);
        } catch (error) {
          console.error(`Error in subscription updated handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "customer.subscription.deleted":
        try {
          await handleSubscriptionDeleted(event.data.object);
        } catch (error) {
          console.error(`Error in subscription deleted handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "checkout.session.completed":
        try {
          await handleCheckoutComplete(event.data.object);
        } catch (error) {
          console.error(`Error in checkout completion handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "invoice.payment_succeeded":
        try {
          await handleInvoicePaymentSucceeded(event.data.object);
        } catch (error) {
          console.error(`Error in invoice payment success handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "invoice.payment_failed":
        try {
          await handleInvoicePaymentFailed(event.data.object);
        } catch (error) {
          console.error(`Error in invoice payment failure handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      case "customer.subscription.trial_will_end":
        try {
          await handleTrialWillEnd(event.data.object);
        } catch (error) {
          console.error(`Error in trial will end handler: ${error.message}`);
          // Continue processing - do not throw error
        }
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error("Uncaught error in webhook handler:", error);
    
    // Important: Still return a 200 response to acknowledge the webhook
    // This prevents Stripe from retrying and clogging the logs
    return new Response(
      JSON.stringify({ 
        received: true,
        error: "An unexpected error occurred, but the webhook has been acknowledged" 
      }),
      { 
        status: 200, // Return 200 even on error to prevent retries
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
