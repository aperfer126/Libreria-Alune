import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const genreRaw = query.genre as string | undefined
  const genre = genreRaw ? genreRaw.split(',').map(g => g.trim()).filter(Boolean) : []
  const author = query.author as string | undefined
  const excludeId = query.excludeId ? Number(query.excludeId) : undefined
  const sort = (query.sort as string) || 'createdAt'
  const limit = Number(query.limit) || 20
  const offset = Number(query.offset) || 0
  const q = query.q as string | undefined

  const where: Record<string, unknown> = {}
  if (genre.length === 1) where.genres = { some: { name: genre[0] } }
  else if (genre.length > 1) where.genres = { some: { name: { in: genre } } }
  if (author) where.author = author
  if (excludeId) where.id = { not: excludeId }
  if (q) where.OR = [
    { title: { contains: q } },
    { author: { contains: q } },
  ]

  const books = await prisma.book.findMany({
    where,
    include: { genres: { select: { id: true, name: true } } },
    orderBy: { [sort]: 'desc' },
    take: limit,
    skip: offset,
  })

  const total = await prisma.book.count({ where })
  return { books, total }
})
