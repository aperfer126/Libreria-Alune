import { getServerSession } from '#auth'
import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!['ADMIN', 'MODERATOR'].includes((session?.user as { role?: string })?.role ?? '')) {
    throw createError({ statusCode: 403 })
  }

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  // Ventas por mes (últimos 12 meses)
  const paidOrders = await prisma.order.findMany({
    where: { status: 'PAID', createdAt: { gte: twelveMonthsAgo } },
    select: { total: true, createdAt: true },
  })

  const salesByMonth: Record<string, { revenue: number; orders: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    salesByMonth[key] = { revenue: 0, orders: 0 }
  }
  for (const order of paidOrders) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`
    if (salesByMonth[key]) {
      salesByMonth[key].revenue += Number(order.total)
      salesByMonth[key].orders += 1
    }
  }

  // Libros más vendidos (top 5) — solo pedidos PAID
  const topBooks = await prisma.orderItem.groupBy({
    by: ['bookId'],
    where: { order: { status: 'PAID' } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  })
  const bookIds = topBooks.map(b => b.bookId)
  const bookNames = await prisma.book.findMany({
    where: { id: { in: bookIds } },
    select: { id: true, title: true },
  })
  const nameMap = Object.fromEntries(bookNames.map(b => [b.id, b.title]))
  const topBooksData = topBooks.map(b => ({
    title: nameMap[b.bookId] ?? `#${b.bookId}`,
    quantity: b._sum.quantity ?? 0,
  }))

  // Ventas por género — solo pedidos PAID
  const itemsByGenre = await prisma.orderItem.findMany({
    where: { order: { status: 'PAID' } },
    include: { book: { include: { genres: true } } },
  })
  const genreSales: Record<string, number> = {}
  for (const item of itemsByGenre) {
    for (const genre of item.book.genres) {
      genreSales[genre.name] = (genreSales[genre.name] ?? 0) + (item.quantity * Number(item.price))
    }
  }

  // Stock bajo (≤ 5 unidades)
  const lowStock = await prisma.book.findMany({
    where: { stock: { lte: 5 } },
    select: { id: true, title: true, stock: true },
    orderBy: { stock: 'asc' },
    take: 10,
  })

  // Estado de pedidos
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  return {
    salesByMonth,
    topBooks: topBooksData,
    genreSales,
    lowStock,
    ordersByStatus: ordersByStatus.map(o => ({ status: o.status, count: o._count.id })),
  }
})
