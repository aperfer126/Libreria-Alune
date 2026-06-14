import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.book.deleteMany()
  console.log('Libros e ítems de pedido borrados.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
