
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.5.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe first
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify user
    const { data: { user }, error: getUserError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (getUserError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user profile
    const { data: profile, error: getProfileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (getProfileError) {
      throw new Error('Profile not found')
    }

    // Parse request body
    const text = await req.text()
    let interval: string
    
    try {
      const body = text ? JSON.parse(text) : {}
      interval = body.interval
      
      if (!interval || !['month', 'year'].includes(interval)) {
        throw new Error('Invalid interval. Must be "month" or "year".')
      }
    } catch (error) {
      console.error('Body parsing error:', error, 'Raw text:', text)
      throw new Error('Invalid request format')
    }

    // Set price ID based on interval
    const priceId = interval === 'year' ? 
      'price_1OgRWCLDj4yzbQfIDEQRu9hy' : // Live mode yearly subscription price
      'price_1OgRWCLDj4yzbQfI7lvRaBOX'   // Live mode monthly subscription price

    if (!profile?.stripe_customer_id) {
      throw new Error('No Stripe customer ID found')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripe_customer_id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/settings`,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
