<template lang="pug">
.app
  header.app-header
    h1 Каталог товаров    

  main.app-main
    SearchForm(
      :filters="state.filters"
      :categories="categories"
      :total="total"
      :loading="loading"
      @update-filters="setFilters"
      @reset="resetFilters"
    )

    ProductList(
      :products="products"
      :loading="loading"
      :error="error"
    )

    Pagination(
      :page="state.page"
      :total-pages="totalPages"
      :loading="loading"
      @update-page="setPage"
    )
</template>

<script setup lang="ts">
import SearchForm from './components/SearchForm.vue'
import ProductList from './components/ProductList.vue'
import Pagination from './components/Pagination.vue'
import { useSearch } from './composables/useSearch'

const {
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
} = useSearch(12)
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.app-header {
  text-align: center;
  margin-bottom: 32px;
}
.app-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #16213e;
}
</style>
