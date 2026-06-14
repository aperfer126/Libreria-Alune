import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const role = (session?.user as { role?: string })?.role
  if (!session || !['ADMIN', 'MODERATOR'].includes(role ?? '')) {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const book = await prisma.book.update({
    where: { id },
    data: {
      title: body.title,
      author: body.author,
      isbn: body.isbn || null,
      price: body.price !== undefined ? Number(body.price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      coverUrl: body.coverUrl || null,
      description: body.description || null,
      publisher: body.publisher || null,
      pages: body.pages ? Number(body.pages) : null,
      binding: body.binding || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      genres: body.genreIds?.length
        ? { set: body.genreIds.map((gid: number) => ({ id: gid })) }
        : undefined,
    },
    include: { genres: { select: { id: true, name: true } } },
  })

  return book
})
