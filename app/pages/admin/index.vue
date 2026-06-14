<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Panel' }]" />
  <div class="container-fluid py-4">
    <div class="row">

      <!-- Sidebar -->
      <div class="col-md-2">
        <AdminSidebar />
      </div>

      <!-- Content -->
      <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 fw-bold mb-0">Panel de administración</h1>
          <div class="d-flex gap-2">
            <NuxtLink to="/admin/libros/nuevo" class="btn btn-primary btn-sm">+ Añadir libro</NuxtLink>
            <NuxtLink to="/admin/pedidos" class="btn btn-outline-secondary btn-sm">Ver pedidos</NuxtLink>
          </div>
        </div>

        <!-- KPIs -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-xl-3">
            <div class="kpi-card bg-primary text-white">
              <div class="kpi-icon">📚</div>
              <div class="kpi-value">{{ stats?.books ?? '—' }}</div>
              <div class="kpi-label">Libros en catálogo</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card bg-success text-white">
              <div class="kpi-icon">📦</div>
              <div class="kpi-value">{{ stats?.orders ?? '—' }}</div>
              <div class="kpi-label">Pedidos totales</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card bg-warning">
              <div class="kpi-icon">👤</div>
              <div class="kpi-value">{{ stats?.users ?? '—' }}</div>
              <div class="kpi-label">Usuarios registrados</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card bg-danger text-white">
              <div class="kpi-icon">💶</div>
              <div class="kpi-value">{{ stats?.revenue ? formatPrice(stats.revenue) : '—' }}</div>
              <div class="kpi-label">Ingresos (pagados)</div>
            </div>
          </div>
        </div>

        <!-- Fila gráficas principales -->
        <div class="row g-3 mb-3">

          <!-- Ingresos por mes -->
          <div class="col-lg-8">
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="fw-semibold">Ingresos mensuales (últimos 12 meses)</span>
              </div>
              <div class="chart-card-body">
                <ClientOnly>
                  <Line v-if="revenueChartData" :data="revenueChartData" :options="lineOptions" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Estado de pedidos -->
          <div class="col-lg-4">
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="fw-semibold">Estado de pedidos</span>
              </div>
              <div class="chart-card-body d-flex align-items-center justify-content-center">
                <ClientOnly>
                  <Doughnut v-if="statusChartData" :data="statusChartData" :options="doughnutOptions" style="max-height:220px" />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <!-- Fila segunda -->
        <div class="row g-3 mb-3">

          <!-- Pedidos por mes -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="fw-semibold">Nº de pedidos por mes</span>
              </div>
              <div class="chart-card-body">
                <ClientOnly>
                  <Bar v-if="ordersChartData" :data="ordersChartData" :options="barOptions" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Ventas por género -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="fw-semibold">Facturación por género</span>
              </div>
              <div class="chart-card-body">
                <ClientOnly>
                  <Bar v-if="genreChartData" :data="genreChartData" :options="barOptionsEur" />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <!-- Fila tercera -->
        <div class="row g-3">

          <!-- Top libros vendidos -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="fw-semibold">Top 5 libros más vendidos</span>
              </div>
              <div class="chart-card-body">
                <ClientOnly>
                  <Bar v-if="topBooksChartData" :data="topBooksChartData" :options="barOptionsHorizontal" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Stock bajo -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-card-header d-flex justify-content-between align-items-center">
                <span class="fw-semibold">Stock bajo (≤ 5 unidades)</span>
                <NuxtLink to="/admin/libros" class="btn btn-outline-secondary btn-xs">Gestionar</NuxtLink>
              </div>
              <div class="chart-card-body p-0">
                <div v-if="!charts?.lowStock?.length" class="text-center text-muted py-4 small">
                  Todos los libros tienen stock suficiente ✓
                </div>
                <table v-else class="table table-sm table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Libro</th>
                      <th class="text-center" style="width:80px">Stock</th>
                      <th style="width:80px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in charts.lowStock" :key="book.id">
                      <td class="small text-truncate" style="max-width:220px">{{ book.title }}</td>
                      <td class="text-center">
                        <span class="badge" :class="book.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'">
                          {{ book.stock }}
                        </span>
                      </td>
                      <td>
                        <NuxtLink :to="`/admin/libros/${book.id}/editar`" class="btn btn-xs btn-outline-primary">Editar</NuxtLink>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Line, Doughnut } from 'vue-chartjs'

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Admin Dashboard | Librería Alune' })

const { data: stats } = await useFetch('/api/admin/stats')
const { data: charts } = await useFetch('/api/admin/charts')

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

const monthLabels = computed(() => {
  if (!charts.value?.salesByMonth) return []
  return Object.keys(charts.value.salesByMonth).map(k => {
    const [year, month] = k.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  })
})

const revenueChartData = computed(() => {
  if (!charts.value?.salesByMonth) return null
  const values = Object.values(charts.value.salesByMonth).map((m: any) => m.revenue)
  return {
    labels: monthLabels.value,
    datasets: [{
      label: 'Ingresos (€)',
      data: values,
      borderColor: '#c0392b',
      backgroundColor: 'rgba(192,57,43,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#c0392b',
    }],
  }
})

const ordersChartData = computed(() => {
  if (!charts.value?.salesByMonth) return null
  const values = Object.values(charts.value.salesByMonth).map((m: any) => m.orders)
  return {
    labels: monthLabels.value,
    datasets: [{
      label: 'Pedidos',
      data: values,
      backgroundColor: 'rgba(52,152,219,0.7)',
      borderRadius: 4,
    }],
  }
})

const statusChartData = computed(() => {
  if (!charts.value?.ordersByStatus) return null
  const colorMap: Record<string, string> = {
    PAID: '#27ae60',
    PENDING: '#f39c12',
    CANCELLED: '#e74c3c',
  }
  const labelMap: Record<string, string> = {
    PAID: 'Pagados',
    PENDING: 'Pendientes',
    CANCELLED: 'Cancelados',
  }
  return {
    labels: charts.value.ordersByStatus.map((o: any) => labelMap[o.status] ?? o.status),
    datasets: [{
      data: charts.value.ordersByStatus.map((o: any) => o.count),
      backgroundColor: charts.value.ordersByStatus.map((o: any) => colorMap[o.status] ?? '#95a5a6'),
      borderWidth: 0,
    }],
  }
})

const genreChartData = computed(() => {
  if (!charts.value?.genreSales) return null
  const entries = Object.entries(charts.value.genreSales as Record<string, number>).sort((a, b) => b[1] - a[1])
  const colors = ['#c0392b','#8e44ad','#2980b9','#27ae60','#f39c12','#16a085','#d35400','#2c3e50']
  return {
    labels: entries.map(([g]) => g),
    datasets: [{
      label: 'Facturación (€)',
      data: entries.map(([, v]) => v),
      backgroundColor: entries.map((_, i) => colors[i % colors.length]),
      borderRadius: 4,
    }],
  }
})

const topBooksChartData = computed(() => {
  if (!charts.value?.topBooks) return null
  return {
    labels: charts.value.topBooks.map((b: any) => b.title.length > 25 ? b.title.slice(0, 25) + '…' : b.title),
    datasets: [{
      label: 'Unidades vendidas',
      data: charts.value.topBooks.map((b: any) => b.quantity),
      backgroundColor: 'rgba(192,57,43,0.75)',
      borderRadius: 4,
    }],
  }
})

const baseFont = { family: 'system-ui, sans-serif', size: 12 }

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => ` ${formatPrice(ctx.raw)}` } },
  },
  scales: {
    y: { ticks: { font: baseFont, callback: (v: any) => formatPrice(v) }, grid: { color: '#f0f0f0' } },
    x: { ticks: { font: baseFont } },
  },
}

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { font: baseFont, stepSize: 1 }, grid: { color: '#f0f0f0' } },
    x: { ticks: { font: baseFont } },
  },
}

const barOptionsEur = {
  ...barOptions,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => ` ${formatPrice(ctx.raw)}` } },
  },
  scales: {
    y: { ticks: { font: baseFont, callback: (v: any) => formatPrice(v) }, grid: { color: '#f0f0f0' } },
    x: { ticks: { font: baseFont } },
  },
}

const barOptionsHorizontal = {
  indexAxis: 'y' as const,
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { font: baseFont, stepSize: 1 }, grid: { color: '#f0f0f0' } },
    y: { ticks: { font: baseFont } },
  },
}

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const, labels: { font: baseFont, padding: 12 } },
  },
}
</script>

<style scoped>
.kpi-card {
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.kpi-icon { font-size: 1.6rem; }
.kpi-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; }
.kpi-label { font-size: 0.8rem; opacity: 0.85; }

.chart-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}
.chart-card-header {
  padding: 14px 18px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}
.chart-card-body {
  padding: 16px 18px;
}

.btn-xs {
  font-size: 0.7rem;
  padding: 2px 8px;
}
</style>
