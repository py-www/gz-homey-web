<script setup>
defineProps({
  type: { type: String, required: true }, // loading | empty | error
  message: { type: String, default: '' },
});
defineEmits(['retry']);
</script>

<template>
  <div class="text-center py-5" role="status" aria-live="polite">
    <template v-if="type === 'loading'">
      <div class="spinner-border text-secondary" aria-hidden="true"></div>
      <p class="mt-3 text-muted mb-0">{{ message || '載入中…' }}</p>
    </template>
    <template v-else-if="type === 'empty'">
      <p class="fs-5 mb-2">{{ message || '查無結果' }}</p>
      <slot />
    </template>
    <template v-else>
      <p class="text-danger mb-3">{{ message || '資料載入失敗' }}</p>
      <button class="btn btn-outline-dark btn-sm" type="button" @click="$emit('retry')">重新載入</button>
    </template>
  </div>
</template>
