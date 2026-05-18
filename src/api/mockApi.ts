import type { Product, PaginatedResponse, SearchFilters } from '../types'

const CATEGORIES = ['Электроника', 'Одежда', 'Книги', 'Для дома', 'Спорт']
const NAMES = [
  'Беспроводные наушники',
  'Беговые кроссовки',
  'Книга рецептов кухня на кадый день',
  'Настольная лампа',
  'Коврик для йоги',
  'Bluetooth-колонка',
  'Зимняя куртка',
  'Руководство по Python',
  'Кофеварка',
  'Теннисная ракетка',
  'Смарт-часы',
  'Походные ботинки',
  'Книга детектив',
  'Декоративная подушка',
  'Гантели',
]

function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name:
      NAMES[i % NAMES.length] + (i >= NAMES.length ? ` #${Math.floor(i / NAMES.length) + 1}` : ''),
    category: CATEGORIES[i % CATEGORIES.length]!,
    price: Math.round((Math.random() * 2000 + 5) * 100) / 100,
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    inStock: Math.random() > 0.25,
  }))
}

const ALL_PRODUCTS = generateProducts(180)

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchProducts(
  filters: SearchFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<Product>> {
  await delay(300 + Math.random() * 400)

  let filtered = ALL_PRODUCTS.filter((p) => {
    if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.minPrice !== null && p.price < filters.minPrice) return false
    if (filters.maxPrice !== null && p.price > filters.maxPrice) return false
    if (filters.minRating !== null && p.rating < filters.minRating) return false
    if (filters.inStock !== null && p.inStock !== filters.inStock) return false
    return true
  })

  filtered.sort((a, b) => {
    const aVal = a[filters.sortBy]
    const bVal = b[filters.sortBy]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return filters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return filters.sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total, page, pageSize, totalPages }
}

export function getCategories(): string[] {
  return [...new Set(ALL_PRODUCTS.map((p) => p.category))]
}
