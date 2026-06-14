import { defineStore } from 'pinia'

export interface CartItem {
  bookId: number
  title: string
  author: string
  price: number
  coverUrl: string | null
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    count: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
  },
  actions: {
    addItem(item: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find((i) => i.bookId === item.bookId)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...item, quantity: 1 })
      }
    },
    removeItem(bookId: number) {
      this.items = this.items.filter((i) => i.bookId !== bookId)
    },
    decreaseItem(bookId: number) {
      const item = this.items.find((i) => i.bookId === bookId)
      if (!item) return
      if (item.quantity <= 1) this.removeItem(bookId)
      else item.quantity--
    },
    clear() {
      this.items = []
    },
  },
  persist: true,
})
