
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getStripeSignature, verifyStripeWebhook, getEventHandler } from "../_shared/webhookUtils.ts";
import * as handlers from "../_shared/webhookHandlers.ts";

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
    // Use the handler based on event type
    const handlerName = getEventHandler(event.type);
    
    if (handlerName && handlers[handlerName]) {
      await handlers[handlerName](event.data.object);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
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
