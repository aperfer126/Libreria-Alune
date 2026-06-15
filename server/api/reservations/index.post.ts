import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'No autenticado' })

  const { bookId } = await readBody(event)
  if (!bookId) throw createError({ statusCode: 400, message: 'bookId requerido' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  const book = await prisma.book.findUnique({ where: { id: Number(bookId) } })
  if (!book) throw createError({ statusCode: 404, message: 'Libro no encontrado' })
  if (book.stock > 0) throw createError({ statusCode: 400, message: 'El libro está disponible, puedes comprarlo directamente' })

  const existing = await prisma.reservation.findUnique({
    where: { userId_bookId: { userId: user.id, bookId: Number(bookId) } },
  })
  if (existing) return { alreadyReserved: true, message: 'Ya tienes este libro reservado' }

  await prisma.reservation.create({ data: { userId: user.id, bookId: Number(bookId) } })
  return { reserved: true, message: 'Reserva realizada correctamente' }
})
