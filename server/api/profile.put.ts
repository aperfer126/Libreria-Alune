import { getServerSession } from '#auth'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'No autenticado' })

  const body = await readBody(event)
  const { name, email, currentPassword, newPassword } = body

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  const updateData: { name?: string; email?: string; password?: string } = {}

  if (name && name.trim()) updateData.name = name.trim()

  if (email && email.trim() && email.trim() !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (exists) throw createError({ statusCode: 409, message: 'Ese email ya está en uso' })
    updateData.email = email.trim()
  }

  if (newPassword) {
    if (!currentPassword) throw createError({ statusCode: 400, message: 'Debes introducir tu contraseña actual' })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) throw createError({ statusCode: 400, message: 'La contraseña actual no es correcta' })
    if (newPassword.length < 6) throw createError({ statusCode: 400, message: 'La nueva contraseña debe tener al menos 6 caracteres' })
    updateData.password = await bcrypt.hash(newPassword, 10)
  }

  if (Object.keys(updateData).length === 0) {
    return { message: 'Sin cambios' }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true }
  })

  return { user: updated }
})
