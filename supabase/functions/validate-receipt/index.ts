
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateReceipt } from "../_shared/receiptHandler.ts";
import { updateUserSubscription } from "../_shared/webhookHandlerUtils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Define CORS headers for browser-based requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the user from the token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    // Get the token from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    const { receiptData } = await req.json();
    
    if (!receiptData) {
      return new Response(JSON.stringify({ error: 'Receipt data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate the receipt with Apple
    const validationResult = await validateReceipt(receiptData, user.id);
    
    if (validationResult.valid) {
      // If receipt is valid, ensure subscription is updated
      const { transactionId, productId } = validationResult;
      
      if (transactionId && productId) {
        // Get latest receipt info from Apple response
        const latestReceiptInfo = validationResult.data.latest_receipt_info?.[0] || {};
        
        // Parse dates
        const purchaseDate = latestReceiptInfo.purchase_date_ms 
          ? new Date(parseInt(latestReceiptInfo.purchase_date_ms)).toISOString() 
          : new Date().toISOString();
          
        const expiresDate = latestReceiptInfo.expires_date_ms
          ? new Date(parseInt(latestReceiptInfo.expires_date_ms)).toISOString()
          : null;
          
        // Update subscription status
        await updateUserSubscription(
          user.id,
          transactionId,
          productId,
          'active',
          null,
          expiresDate
        );
      }
      
      return new Response(JSON.stringify({ 
        valid: true,
        message: 'Receipt verified successfully',
        subscription: { status: 'active' }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        valid: false,
        message: 'Receipt validation failed',
        status: validationResult.data?.status
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error validating receipt:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
