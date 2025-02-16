
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

    const { data: { user }, error: getUserError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (getUserError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user profile
    const { data: profile, error: getProfileError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (getProfileError) {
      throw new Error('Profile not found')
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    // Update profile with Stripe customer ID
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', user.id)

    if (updateError) {
      throw new Error('Failed to update profile')
    }

    return new Response(
      JSON.stringify({ customer_id: customer.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Create customer error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create customer'
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
