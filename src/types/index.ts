export interface Product {
  id: number
  name: string
  category: string
  price: number
  rating: number
  inStock: boolean
}

export interface SearchFilters {
  query: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  minRating: number | null
  inStock: boolean | null
  sortBy: 'name' | 'price' | 'rating'
  sortOrder: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
