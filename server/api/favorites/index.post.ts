import { prisma } from '../../lib/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401 })

  const { bookId } = await readBody<{ bookId: number }>(event)
  if (!bookId) throw createError({ statusCode: 400, statusMessage: 'bookId requerido' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 401 })

  const favorite = await prisma.favorite.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    update: {},
    create: { userId: user.id, bookId },
  })

  return favorite
})
