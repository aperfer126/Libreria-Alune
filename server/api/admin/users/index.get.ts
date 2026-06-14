import { getServerSession } from '#auth'
import { prisma } from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if ((session?.user as any)?.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users
})
