<script setup></script>
<template lang="pug">
    .app
  header.app-header
    h1 🛒 Каталог товаров
    p.subtitle Поиск и фильтрация с синхронизацией URL

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
