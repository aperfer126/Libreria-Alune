import { getServerSession } from '#auth'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if ((session?.user as any)?.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const { name, email, password, role } = await readBody(event)

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nombre, email y contraseña son obligatorios' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Ya existe un usuario con ese email' })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return user
})
