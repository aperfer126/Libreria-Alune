import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  const books = await prisma.book.findMany({
    where: {
      stock: 0,
      reservations: { some: {} },
    },
    select: {
      id: true,
      title: true,
      author: true,
      coverUrl: true,
      _count: { select: { reservations: true } },
      reservations: {
        orderBy: { createdAt: 'asc' },
        select: {
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { id: 'asc' },
  })

  return { books }
})
