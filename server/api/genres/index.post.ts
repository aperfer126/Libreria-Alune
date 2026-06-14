import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!['ADMIN', 'MODERATOR'].includes((session?.user as { role?: string })?.role ?? '')) throw createError({ statusCode: 403 })

  const { name } = await readBody<{ name: string }>(event)
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })

  try {
    return await prisma.genre.create({ data: { name: name.trim() } })
  } catch {
    throw createError({ statusCode: 409, statusMessage: 'Ya existe un género con ese nombre' })
  }
})
