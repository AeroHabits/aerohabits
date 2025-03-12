
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getStripeSignature, verifyStripeWebhook, processWebhookEvent } from "../_shared/webhookUtils.ts";
import { registerWebhookHandlers } from "../_shared/webhookHandlers.ts";
import * as handlers from "../_shared/webhookHandlers.ts";

// Register all webhook handlers
registerWebhookHandlers({
  "customer.subscription.created": handlers.handleSubscriptionCreated,
  "customer.subscription.updated": handlers.handleSubscriptionUpdated,
  "customer.subscription.deleted": handlers.handleSubscriptionDeleted,
  "checkout.session.completed": handlers.handleCheckoutComplete,
  "invoice.payment_succeeded": handlers.handleInvoicePaymentSucceeded,
  "invoice.payment_failed": handlers.handleInvoicePaymentFailed,
  "customer.subscription.trial_will_end": handlers.handleTrialWillEnd
});

serve(async (req) => {
  const signature = getStripeSignature(req);

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
    });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const body = await req.text();
  let event;

  try {
    event = verifyStripeWebhook(body, signature, webhookSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }

  console.log(`Event type: ${event.type}`);

  try {
    // Process the event using our registry
    const processed = await processWebhookEvent(event.type, event.data.object);
    
    return new Response(JSON.stringify({ 
      received: true,
      processed: processed
    }), {
      status: 200,
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: "An error occurred processing the webhook" }),
      { status: 500 }
    );
  }
});
