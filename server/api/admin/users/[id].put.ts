import { getServerSession } from '#auth'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if ((session?.user as any)?.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const { name, email, password, role } = await readBody(event)

  const data: Record<string, any> = {}
  if (name) data.name = name
  if (email) data.email = email
  if (role) data.role = ['ADMIN', 'MODERATOR', 'USER'].includes(role) ? role : 'USER'
  if (password) data.password = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return user
})
