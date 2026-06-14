import Stripe from 'stripe'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-09-30.acacia' })

  const body = await readRawBody(event)
  const sig = getHeader(event, 'stripe-signature')

  if (!body || !sig) throw createError({ statusCode: 400 })

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, config.stripeWebhookSecret)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Webhook signature inválida' })
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object as Stripe.PaymentIntent
    const orderId = Number(pi.metadata?.orderId)
    if (!orderId) return { ok: true }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID', stripeSessionId: pi.id },
      include: { items: true },
    })

    for (const item of order.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  }

  return { ok: true }
})
