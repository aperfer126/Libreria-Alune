import { prisma } from '../../lib/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 401 })

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      book: {
        include: { genres: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return favorites.map(f => f.book)
})
