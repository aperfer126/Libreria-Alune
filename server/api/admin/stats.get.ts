import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!['ADMIN', 'MODERATOR'].includes((session?.user as { role?: string })?.role ?? '')) {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const [books, orders, users, revenue] = await Promise.all([
    prisma.book.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
  ])

  return { books, orders, users, revenue: Number(revenue._sum.total ?? 0) }
})
