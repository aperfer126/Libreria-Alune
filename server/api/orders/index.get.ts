import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })

  const role = (session.user as { role?: string }).role
  const isStaff = role === 'ADMIN' || role === 'MODERATOR'

  const orders = await prisma.order.findMany({
    where: isStaff ? undefined : { userId: user.id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { book: { select: { id: true, title: true, author: true, coverUrl: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
})
