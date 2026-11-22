<script setup>
import { toastState } from '../stores/toast';

const typeClass = { success: 'text-bg-dark', error: 'text-bg-danger', warning: 'text-bg-warning' };
</script>

<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090">
    <div
      v-for="t in toastState.items"
      :key="t.id"
      class="toast show border-0 rounded-4"
      :class="typeClass[t.type] || typeClass.success"
      role="status"
      aria-live="polite"
    >
      <div class="toast-body">{{ t.message }}</div>
    </div>
  </div>
</template>
