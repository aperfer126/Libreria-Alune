import { getServerSession } from '#auth'
import { prisma } from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const role = (session?.user as { role?: string })?.role
  if (!['ADMIN', 'MODERATOR'].includes(role ?? '')) {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          book: { select: { id: true, title: true, author: true, coverUrl: true } },
        },
      },
    },
  })

  if (!order) throw createError({ statusCode: 404, statusMessage: 'Pedido no encontrado' })
  return order
})
