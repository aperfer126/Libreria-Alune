<template>
  <form novalidate @submit.prevent="submit">
    <div class="row g-3">
      <div class="col-md-8">
        <label class="form-label fw-semibold">Título <span class="text-danger">*</span></label>
        <input
          v-model="form.title"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': submitted && !form.title.trim() }"
        />
        <div class="invalid-feedback">El título es obligatorio.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label fw-semibold">ISBN</label>
        <input v-model="form.isbn" type="text" class="form-control" />
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">Autor <span class="text-danger">*</span></label>
        <input
          v-model="form.author"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': submitted && !form.author.trim() }"
        />
        <div class="invalid-feedback">El autor es obligatorio.</div>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-semibold">Precio (€) <span class="text-danger">*</span></label>
        <input
          v-model.number="form.price"
          type="number"
          step="0.01"
          min="0"
          class="form-control"
          :class="{ 'is-invalid': submitted && !(form.price > 0) }"
        />
        <div class="invalid-feedback">Introduce un precio válido.</div>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-semibold">Stock <span class="text-danger">*</span></label>
        <input
          v-model.number="form.stock"
          type="number"
          min="0"
          class="form-control"
          :class="{ 'is-invalid': submitted && form.stock < 0 }"
        />
        <div class="invalid-feedback">El stock no puede ser negativo.</div>
      </div>

      <!-- Géneros (selección múltiple) -->
      <div class="col-12">
        <label class="form-label fw-semibold">
          Géneros <span class="text-danger">*</span>
          <span class="text-muted fw-normal small ms-1">(puedes seleccionar varios)</span>
        </label>
        <div class="genre-grid">
          <label
            v-for="g in genres"
            :key="g.id"
            class="genre-chip"
            :class="{ selected: form.genreIds.includes(g.id) }"
          >
            <input type="checkbox" :value="g.id" v-model="form.genreIds" class="visually-hidden" />
            {{ g.name }}
          </label>
        </div>
        <div v-if="submitted && form.genreIds.length === 0" class="text-danger small mt-1">
          Selecciona al menos un género.
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">Editorial</label>
        <input v-model="form.publisher" type="text" class="form-control" />
      </div>

      <div class="col-md-3">
        <label class="form-label fw-semibold">Año de publicación</label>
        <input v-model="form.publishedAt" type="date" class="form-control" />
      </div>

      <div class="col-md-3">
        <label class="form-label fw-semibold">Páginas</label>
        <input v-model.number="form.pages" type="number" min="1" class="form-control" />
      </div>

      <div class="col-md-3">
        <label class="form-label fw-semibold">Encuadernación</label>
        <select v-model="form.binding" class="form-select">
          <option value="">—</option>
          <option>Tapa blanda</option>
          <option>Tapa dura</option>
          <option>Rústica</option>
          <option>Bolsillo</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">URL de portada</label>
        <input v-model="form.coverUrl" type="url" class="form-control" placeholder="https://..." />
      </div>

      <div class="col-12">
        <label class="form-label fw-semibold">Descripción / Sinopsis</label>
        <textarea v-model="form.description" class="form-control" rows="4"></textarea>
      </div>

      <div v-if="form.coverUrl" class="col-12">
        <p class="form-label fw-semibold mb-1">Vista previa portada</p>
        <img :src="form.coverUrl" alt="Portada" style="height: 120px; object-fit: cover" class="rounded border" />
      </div>
    </div>

    <!-- Resumen de errores -->
    <div v-if="submitted && hasErrors" class="alert alert-danger mt-4 py-2 small">
      Corrige los campos marcados en rojo antes de continuar.
    </div>

    <div class="mt-4 d-flex gap-2">
      <button type="submit" class="btn btn-primary px-4" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ submitLabel }}
      </button>
      <NuxtLink to="/admin/libros" class="btn btn-outline-secondary">Cancelar</NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  initial?: Record<string, any>
  submitLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ submit: [form: Record<string, any>] }>()

const { data: genresData } = await useFetch('/api/genres')
const genres = computed(() => genresData.value ?? [])

const submitted = ref(false)

const form = reactive({
  title: props.initial?.title ?? '',
  author: props.initial?.author ?? '',
  isbn: props.initial?.isbn ?? '',
  price: props.initial?.price ? Number(props.initial.price) : 0,
  stock: props.initial?.stock ?? 0,
  coverUrl: props.initial?.coverUrl ?? '',
  description: props.initial?.description ?? '',
  genreIds: (props.initial?.genres ?? []).map((g: { id: number }) => g.id) as number[],
  publishedAt: props.initial?.publishedAt ? props.initial.publishedAt.slice(0, 10) : '',
  publisher: props.initial?.publisher ?? '',
  pages: props.initial?.pages ?? '',
  binding: props.initial?.binding ?? '',
})

const hasErrors = computed(() =>
  !form.title.trim() ||
  !form.author.trim() ||
  !(form.price > 0) ||
  form.stock < 0 ||
  form.genreIds.length === 0
)

function submit() {
  submitted.value = true
  if (hasErrors.value) return
  emit('submit', { ...form })
}
</script>

<style scoped>
.genre-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.genre-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 20px;
  border: 1.5px solid #dee2e6;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s;
  user-select: none;
  background: #fff;
  color: #495057;
}
.genre-chip:hover {
  border-color: #c0392b;
  color: #c0392b;
}
.genre-chip.selected {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
  font-weight: 600;
}
</style>
