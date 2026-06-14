import { prisma } from '../../lib/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401 })

  const bookId = Number(getRouterParam(event, 'bookId'))
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 401 })

  await prisma.favorite.deleteMany({ where: { userId: user.id, bookId } })
  return { ok: true }
})
