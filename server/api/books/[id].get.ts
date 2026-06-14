import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const book = await prisma.book.findUnique({
    where: { id },
    include: { genres: { select: { id: true, name: true } } },
  })
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Libro no encontrado' })
  return book
})
