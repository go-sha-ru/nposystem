<template lang="pug">
.search-form
  .search-row
    .search-input-group
      input(v-model="local.query" type="text" placeholder="Поиск по названию..." @keyup.enter="onSearch")
      button.search-btn(@click="onSearch" :disabled="loading")        
        span Поиск

  .filters-row
    .filter-group
      label Категория
      select(v-model="local.category" @change="onFilterChange")
        option(value="") Все категории
        option(v-for="cat in categories" :key="cat" :value="cat") {{ cat }}

    .filter-group
      label Минимальная цена
      input(v-model.number="local.minPrice" type="number" min="0" step="0.01" placeholder="0" @change="onFilterChange")

    .filter-group
      label Максимальная цена
      input(v-model.number="local.maxPrice" type="number" min="0" step="0.01" placeholder="∞" @change="onFilterChange")

    .filter-group
      label Минимальный рейтинг
      select(v-model.number="local.minRating" @change="onFilterChange")
        option(value="") Любой
        option(v-for="r in [1, 2, 3, 4]" :key="r" :value="r") {{ '★'.repeat(r) }}

    .filter-group
      label
        input(v-model="local.inStock" type="checkbox" @change="onFilterChange")
        | Только в наличии

    .filter-group
      label Сортировка
      select(v-model="local.sortBy" @change="onFilterChange")
        option(value="name") По названию
        option(value="price") По цене
        option(value="rating") По рейтингу

    .filter-group
      label Порядок
      select(v-model="local.sortOrder" @change="onFilterChange")
        option(value="asc") ↑ По возрастанию
        option(value="desc") ↓ По убыванию

  .form-actions
    button.reset-btn(@click="resetFilters") Сбросить фильтры
    span.results-count(v-if="!loading") Найдено: {{ total }} товаров
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SearchFilters } from '../types'

const props = defineProps<{
  filters: SearchFilters
  categories: string[]
  total: number
  loading: boolean
}>()

const emit = defineEmits<{
  'update-filters': [filters: Partial<SearchFilters>]
  reset: []
}>()

const local = reactive<SearchFilters>({ ...props.filters })

watch(
  () => props.filters,
  (newFilters) => Object.assign(local, newFilters),
  { deep: true },
)

function onSearch() {
  emit('update-filters', { query: local.query })
}

function onFilterChange() {
  const updates: Partial<SearchFilters> = {}
  if (local.category !== props.filters.category) updates.category = local.category
  if (local.minPrice !== props.filters.minPrice) updates.minPrice = local.minPrice || null
  if (local.maxPrice !== props.filters.maxPrice) updates.maxPrice = local.maxPrice || null
  if (local.minRating !== props.filters.minRating) updates.minRating = local.minRating || null
  if (local.inStock !== props.filters.inStock) updates.inStock = local.inStock || null
  if (local.sortBy !== props.filters.sortBy) updates.sortBy = local.sortBy
  if (local.sortOrder !== props.filters.sortOrder) updates.sortOrder = local.sortOrder
  if (Object.keys(updates).length > 0) emit('update-filters', updates)
}

function resetFilters() {
  Object.assign(local, {
    query: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: null,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  emit('reset')
}
</script>

<style scoped>
.search-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}
.search-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 16px;
}
.search-input-group {
  flex: 1;
  display: flex;
  gap: 12px;
}
.search-input-group input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input-group input:focus {
  border-color: #4361ee;
}
.search-btn {
  padding: 12px 24px;
  background: #4361ee;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.search-btn:hover:not(:disabled) {
  background: #3a56d4;
}
.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-group select,
.filter-group input[type='number'] {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.filter-group select:focus,
.filter-group input:focus {
  border-color: #4361ee;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
.reset-btn {
  padding: 8px 16px;
  background: transparent;
  color: #e63946;
  border: 2px solid #e63946;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.reset-btn:hover {
  background: #e63946;
  color: #fff;
}
.results-count {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>
