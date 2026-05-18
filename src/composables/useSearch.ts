// src/composables/useSearch.ts
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { SearchFilters, Product } from '../types'
import { fetchProducts, getCategories } from '../api/mockApi'

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStock: null,
  sortBy: 'name',
  sortOrder: 'asc',
}

function filtersToQueryParams(filters: SearchFilters, page: number): Record<string, string> {
  const params: Record<string, string> = {}
  if (filters.query) params.q = filters.query
  if (filters.category) params.cat = filters.category
  if (filters.minPrice !== null) params.minPrice = String(filters.minPrice)
  if (filters.maxPrice !== null) params.maxPrice = String(filters.maxPrice)
  if (filters.minRating !== null) params.minRating = String(filters.minRating)
  if (filters.inStock !== null) params.inStock = String(filters.inStock)
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) params.sortBy = filters.sortBy
  if (filters.sortOrder !== DEFAULT_FILTERS.sortOrder) params.sortOrder = filters.sortOrder
  if (page > 1) params.page = String(page)
  return params
}

function queryParamsToFilters(params: Record<string, string | string[]>): {
  filters: SearchFilters
  page: number
} {
  const filters: SearchFilters = { ...DEFAULT_FILTERS }
  const get = (key: string) => {
    const val = params[key]
    return Array.isArray(val) ? val[0] : val
  }
  if (get('q')) filters.query = get('q')!
  if (get('cat')) filters.category = get('cat')!
  if (get('minPrice')) filters.minPrice = Number(get('minPrice'))
  if (get('maxPrice')) filters.maxPrice = Number(get('maxPrice'))
  if (get('minRating')) filters.minRating = Number(get('minRating'))
  if (get('inStock')) filters.inStock = get('inStock') === 'true'
  if (get('sortBy')) filters.sortBy = get('sortBy')! as SearchFilters['sortBy']
  if (get('sortOrder')) filters.sortOrder = get('sortOrder')! as SearchFilters['sortOrder']
  const page = get('page') ? Number(get('page')) : 1
  return { filters, page }
}

export function useSearch(pageSize = 12) {
  const router = useRouter()
  const route = useRoute()

  const state = reactive({ filters: { ...DEFAULT_FILTERS }, page: 1, pageSize })
  const products = reactive<Product[]>([])
  const total = ref(0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = getCategories()

  function updateUrl() {
    router.replace({ query: filtersToQueryParams(state.filters, state.page) })
  }

  async function loadProducts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetchProducts(state.filters, state.page, pageSize)
      products.length = 0
      products.push(...res.data)
      total.value = res.total
    } catch {
      error.value = 'Ошибка загрузки данных. Попробуйте позже.'
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<SearchFilters>) {
    Object.assign(state.filters, newFilters)
    state.page = 1
    updateUrl()
    loadProducts()
  }

  function setPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages.value) return
    state.page = newPage
    updateUrl()
    loadProducts()
  }

  function resetFilters() {
    state.filters = { ...DEFAULT_FILTERS }
    state.page = 1
    updateUrl()
    loadProducts()
  }

  function syncFromUrl() {
    const { filters, page } = queryParamsToFilters(route.query as Record<string, string | string[]>)
    state.filters = filters
    state.page = page
  }

  watch(
    () => route.query,
    () => {
      syncFromUrl()
      loadProducts()
    },
    { deep: true },
  )
  onMounted(() => {
    syncFromUrl()
    loadProducts()
  })

  return {
    state,
    products,
    total,
    totalPages,
    loading,
    error,
    categories,
    setFilters,
    setPage,
    resetFilters,
  }
}
