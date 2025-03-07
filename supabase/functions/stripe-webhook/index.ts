
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
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Event type: ${event.type}`);

    try {
      // Process different Stripe webhook events
      switch (event.type) {
        case "customer.subscription.created":
          await handleSubscriptionCreated(event.data.object);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;
        case "checkout.session.completed":
          await handleCheckoutComplete(event.data.object);
          break;
        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object);
          break;
        case "customer.subscription.trial_will_end":
          await handleTrialWillEnd(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(`Error processing webhook: ${error.message}`);
      
      // Important: Return a 200 response even for processing errors
      // This prevents Stripe from retrying the webhook, which could cause more issues
      // You can implement a queue or other mechanism to handle failed events
      return new Response(
        JSON.stringify({ 
          received: true,
          warning: "Event was received but there was an error in processing. The event has been acknowledged to prevent retries." 
        }),
        { 
          status: 200, // Return 200 even on error to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error("Uncaught error in webhook handler:", error);
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
