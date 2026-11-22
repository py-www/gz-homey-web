<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});
const emit = defineEmits(['change']);

function go(p) {
  if (p >= 1 && p <= props.totalPages && p !== props.page) emit('change', p);
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="商品分頁" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <button class="page-link" type="button" aria-label="上一頁" :disabled="page === 1" @click="go(page - 1)">&laquo;</button>
      </li>
      <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: p === page }">
        <button class="page-link" type="button" :aria-current="p === page ? 'page' : undefined" @click="go(p)">{{ p }}</button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <button class="page-link" type="button" aria-label="下一頁" :disabled="page === totalPages" @click="go(page + 1)">&raquo;</button>
      </li>
    </ul>
  </nav>
</template>
