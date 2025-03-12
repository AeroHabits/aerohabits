
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAppStoreSignature, verifyAppStoreWebhook, processWebhookEvent } from "../_shared/webhookUtils.ts";
import { registerWebhookHandlers } from "../_shared/webhookHandlers.ts";
import * as handlers from "../_shared/webhookHandlers.ts";

// Register all webhook handlers
registerWebhookHandlers({
  "SUBSCRIPTION_PURCHASED": handlers.handleSubscriptionCreated,
  "SUBSCRIPTION_RENEWED": handlers.handleRenewalSucceeded,
  "SUBSCRIPTION_EXPIRED": handlers.handleSubscriptionDeleted,
  "PURCHASE_COMPLETED": handlers.handlePurchaseComplete,
  "RENEWAL_FAILED": handlers.handleRenewalFailed,
  "SUBSCRIPTION_WILL_RENEW": handlers.handleTrialWillEnd
});

serve(async (req) => {
  const signature = getAppStoreSignature(req);

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
    });
  }

  const webhookSecret = Deno.env.get("APPSTORE_WEBHOOK_SECRET");
  const body = await req.text();
  let event;

  try {
    event = verifyAppStoreWebhook(body, signature, webhookSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }

  console.log(`Event type: ${event.notificationType}`);

  try {
    // Process the event using our registry
    const processed = await processWebhookEvent(event.notificationType, event.data);
    
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
