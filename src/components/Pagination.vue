<template lang="pug">
.pagination
  nav.pagination-nav(v-if="totalPages > 1")
    button.page-btn(:disabled="page <= 1 || loading" @click="goToPage(page - 1)") ←

    .page-numbers
      button.page-num-btn(
        v-for="p in visiblePages"
        :key="p"
        :class="{ active: p === page }"
        :disabled="loading"
        @click="goToPage(p)"
      ) {{ p === -1 ? '...' : p }}

    button.page-btn(:disabled="page >= totalPages || loading" @click="goToPage(page + 1)") →

  .pagination-info(v-if="totalPages > 1") Страница {{ page }} из {{ totalPages }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; totalPages: number; loading: boolean }>()
const emit = defineEmits<{ 'update-page': [page: number] }>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const delta = 2
  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= props.page - delta && i <= props.page + delta))
      pages.push(i)
  }
  const result: number[] = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i]! - pages[i - 1]! > 1) result.push(-1)
    result.push(pages[i]!)
  }
  return result
})

function goToPage(newPage: number) {
  if (newPage < 1 || newPage > props.totalPages || props.loading) return
  emit('update-page', newPage)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px 0;
}
.pagination-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-btn {
  padding: 8px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) {
  border-color: #4361ee;
  color: #4361ee;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 4px;
}
.page-num-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.page-num-btn:hover:not(:disabled):not(.active) {
  border-color: #4361ee;
}
.page-num-btn.active {
  background: #4361ee;
  color: #fff;
  border-color: #4361ee;
}
.pagination-info {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>
