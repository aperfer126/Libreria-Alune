import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const role = (session?.user as { role?: string })?.role
  if (!session || !['ADMIN', 'MODERATOR'].includes(role ?? '')) {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const body = await readBody(event)
  const { title, author, isbn, price, stock, coverUrl, description, genreIds, publishedAt, publisher, pages, binding } = body

  if (!title || !author || !price || !genreIds?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
  }

  const book = await prisma.book.create({
    data: {
      title, author, isbn: isbn || null,
      price: Number(price), stock: Number(stock) || 0,
      coverUrl: coverUrl || null, description: description || null,
      publisher: publisher || null, pages: pages ? Number(pages) : null, binding: binding || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      genres: { connect: genreIds.map((id: number) => ({ id })) },
    },
    include: { genres: { select: { id: true, name: true } } },
  })

  return book
})
