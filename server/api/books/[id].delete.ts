import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const role = (session?.user as { role?: string })?.role
  if (!session || !['ADMIN', 'MODERATOR'].includes(role ?? '')) {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const id = Number(getRouterParam(event, 'id'))
  await prisma.book.delete({ where: { id } })
  return { ok: true }
})
