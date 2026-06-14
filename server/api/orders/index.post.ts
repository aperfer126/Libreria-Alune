import Stripe from 'stripe'
import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) {
    throw createError({ statusCode: 401, statusMessage: 'Debes iniciar sesión para realizar un pedido' })
  }

  const { items, shippingAddress, customerEmail } = await readBody<{
    items: { bookId: number; quantity: number }[]
    shippingAddress?: string
    customerEmail?: string
  }>(event)
  if (!items?.length) throw createError({ statusCode: 400, statusMessage: 'El carrito está vacío' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })

  const bookIds = items.map((i) => i.bookId)
  const books = await prisma.book.findMany({ where: { id: { in: bookIds } } })

  let total = 0
  for (const item of items) {
    const book = books.find((b) => b.id === item.bookId)
    if (!book) throw createError({ statusCode: 404, statusMessage: `Libro ${item.bookId} no encontrado` })
    if (book.stock < item.quantity) throw createError({ statusCode: 400, statusMessage: `Stock insuficiente para "${book.title}"` })
    total += Number(book.price) * item.quantity
  }

  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-09-30.acacia' })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      ...(shippingAddress ? { shippingAddress } : {}),
      items: {
        create: items.map((item) => {
          const book = books.find((b) => b.id === item.bookId)!
          return { bookId: item.bookId, quantity: item.quantity, price: Number(book.price) }
        }),
      },
    },
  })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'eur',
    payment_method_types: ['card'],
    ...(customerEmail ? { receipt_email: customerEmail } : {}),
    metadata: { orderId: String(order.id) },
  })

  return { clientSecret: paymentIntent.client_secret, orderId: order.id }
})
