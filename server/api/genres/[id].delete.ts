import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!['ADMIN', 'MODERATOR'].includes((session?.user as { role?: string })?.role ?? '')) throw createError({ statusCode: 403 })

  const id = Number(getRouterParam(event, 'id'))
  await prisma.genre.delete({ where: { id } })
  return { ok: true }
})
