<script setup>
import { formatPrice } from '../utils/format';

defineProps({ product: { type: Object, required: true } });
</script>

<template>
  <article class="h-100">
    <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="product-card h-100">
      <div class="product-frame ratio ratio-1x1">
        <img :src="product.imageUrl" :alt="product.name" class="product-img" loading="lazy" />
      </div>
      <div class="pt-3">
        <p v-if="product.category" class="small text-body-secondary mb-1">{{ product.category.name }}</p>
        <h3 class="product-name fs-6 fw-medium mb-1">{{ product.name }}</h3>
        <p class="mb-0">
          {{ formatPrice(product.price) }}
          <span v-if="product.stock === 0" class="text-danger small ms-2">目前缺貨</span>
        </p>
      </div>
    </RouterLink>
  </article>
</template>
