import { prisma } from '../../lib/prisma'

export default defineEventHandler(async () => {
  return prisma.genre.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { books: true } } } })
})
