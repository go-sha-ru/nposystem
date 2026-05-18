<template lang="pug">
.product-list
  .loading-overlay(v-if="loading")
    .spinner
    span Загрузка...

  .error-message(v-if="error")
    svg.icon-alert(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2")
      circle(cx="12" cy="12" r="10")
      line(x1="12" y1="8" x2="12" y2="12")
      line(x1="12" y1="16" x2="12.01" y2="16")
    span {{ error }}

  .empty-state(v-else-if="products.length === 0")
    svg.icon-empty(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5")
      path(d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z")
    h3 Ничего не найдено
    p Попробуйте изменить параметры поиска

  .products-grid(v-else)
    .product-card(v-for="product in products" :key="product.id")
      .product-header
        h3.product-name {{ product.name }}
        span.badge(v-if="!product.inStock") Нет в наличии
      .product-meta
        span.category {{ product.category }}
        .price-rating
          span.price {{ product.price.toFixed(2) }} ₽
          .rating
            span.stars
              span.star(v-for="i in 5" :key="i" :class="{ filled: i <= Math.round(product.rating) }") ★
            span.rating-value {{ product.rating }}
</template>

<script setup lang="ts">
import type { Product } from '../types'
defineProps<{ products: Product[]; loading: boolean; error: string | null }>()
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.product-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.product-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #16213e;
}
.badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: #ffe0e0;
  color: #c0392b;
  border-radius: 12px;
  white-space: nowrap;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.category {
  font-size: 0.85rem;
  color: #6c757d;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}
.price-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.price {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d6a4f;
}
.star {
  color: #ddd;
  font-size: 0.9rem;
}
.star.filled {
  color: #f4a261;
}
.rating-value {
  font-size: 0.8rem;
  color: #888;
}
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
  color: #6c757d;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #4361ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #ffe0e0;
  border-radius: 8px;
  color: #c0392b;
}
.empty-state {
  text-align: center;
  padding: 48px;
  color: #6c757d;
}
.empty-state svg {
  margin-bottom: 12px;
}
</style>
