import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event) as { session_id?: string }
  if (!session_id) throw createError({ statusCode: 400, statusMessage: 'session_id requerido' })

  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-09-30.acacia' })

  const session = await stripe.checkout.sessions.retrieve(session_id)
  return { status: session.status }
})
