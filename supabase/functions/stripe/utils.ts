
import { stripe } from "./stripe.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

export async function createOrRetrieveCustomer({
  uuid,
}: {
  uuid: string
}): Promise<any> {
  // First check if customer already exists
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', uuid)
    .single()

  if (subscription?.stripe_customer_id) {
    const existingCustomer = await stripe.customers.retrieve(subscription.stripe_customer_id)
    console.log('Retrieved existing customer:', existingCustomer.id)
    return existingCustomer
  }

  // If no customer exists, get user data and create one
  const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(uuid)
  if (userError) {
    console.error('Error getting user:', userError)
    throw userError
  }

  if (!user?.email) {
    throw new Error('User email is required')
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.user_metadata?.full_name,
    metadata: {
      supabaseUUID: uuid,
    },
  })
  console.log('Created new customer:', customer.id)

  // Store the mapping
  const { error: createError } = await supabaseAdmin
    .from('subscriptions')
    .insert([{ 
      user_id: uuid,
      stripe_customer_id: customer.id,
    }])

  if (createError) {
    console.error('Error storing customer mapping:', createError)
    throw createError
  }

  return customer
}
