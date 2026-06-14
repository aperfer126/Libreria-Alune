import { getServerSession } from '#auth'
import { prisma } from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if ((session?.user as any)?.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const currentUserId = (session?.user as any)?.id

  if (id === currentUserId) {
    throw createError({ statusCode: 400, statusMessage: 'No puedes eliminar tu propia cuenta' })
  }

  await prisma.user.delete({ where: { id } })

  return { ok: true }
})
