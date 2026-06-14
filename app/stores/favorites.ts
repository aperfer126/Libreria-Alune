import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<Set<number>>(new Set())
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    try {
      const books = await $fetch<{ id: number }[]>('/api/favorites')
      ids.value = new Set(books.map(b => b.id))
      loaded.value = true
    } catch {
      ids.value = new Set()
    }
  }

  function isFavorite(bookId: number) {
    return ids.value.has(bookId)
  }

  async function toggle(bookId: number) {
    if (ids.value.has(bookId)) {
      await $fetch(`/api/favorites/${bookId}`, { method: 'DELETE' })
      ids.value.delete(bookId)
      ids.value = new Set(ids.value)
    } else {
      await $fetch('/api/favorites', { method: 'POST', body: { bookId } })
      ids.value.add(bookId)
      ids.value = new Set(ids.value)
    }
  }

  function clear() {
    ids.value = new Set()
    loaded.value = false
  }

  return { ids, loaded, load, isFavorite, toggle, clear }
})
