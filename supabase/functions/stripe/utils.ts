
import { stripe } from "./stripe.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

export async function createOrRetrieveCustomer({
  uuid,
}: {
  uuid: string
}) {
  const { data: subscription, error: subscriptionError } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', uuid)
    .single()

  if (subscription?.stripe_customer_id) {
    return await stripe.customers.retrieve(subscription.stripe_customer_id)
  }

  // No customer record found, let's create one
  const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(uuid)
  if (userError) throw userError

  const customer = await stripe.customers.create({
    email: user?.email,  // Use actual email instead of UUID
    name: user?.user_metadata?.full_name,
    metadata: {
      supabaseUUID: uuid,
    },
  })

  // Insert the new customer ID into our Supabase mapping table
  const { error: createError } = await supabaseAdmin
    .from('subscriptions')
    .insert([
      {
        user_id: uuid,
        stripe_customer_id: customer.id,
      },
    ])

  if (createError) throw createError

  return customer
}
