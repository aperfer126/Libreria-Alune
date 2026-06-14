import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!['ADMIN', 'MODERATOR'].includes((session?.user as { role?: string })?.role ?? '')) throw createError({ statusCode: 403 })

  const id = Number(getRouterParam(event, 'id'))
  const { name } = await readBody<{ name: string }>(event)
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })

  return prisma.genre.update({ where: { id }, data: { name: name.trim() } })
})
