<script setup>
import { useRouter } from 'vue-router';
import { authState, logout } from '../stores/auth';
import { cartState, clearCart } from '../stores/cart';
import { showToast } from '../stores/toast';

const router = useRouter();

function onLogout() {
  logout();
  clearCart();
  showToast('已登出');
  router.push({ name: 'home' });
}
</script>

<template>
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-md container-gz" aria-label="主選單">
      <RouterLink class="navbar-brand brand fs-5" to="/">GZ HOMEY</RouterLink>
      <button
        class="btn icon-btn position-relative ms-auto me-2 order-md-last p-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#cartOffcanvas"
        aria-controls="cartOffcanvas"
        :aria-label="`開啟購物車，目前 ${cartState.totalQuantity} 件`"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <path d="M6 7h12l-1 13H7L6 7z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
        <span v-if="cartState.totalQuantity" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: var(--gz-orange)">
          {{ cartState.totalQuantity }}
        </span>
      </button>
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="切換選單"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="mainNav" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-auto gap-md-3">
          <li class="nav-item"><RouterLink class="nav-link" to="/">首頁</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/products">所有商品</RouterLink></li>
        </ul>
        <div class="d-flex align-items-center gap-2 py-2 py-md-0 me-md-3">
          <template v-if="authState.user">
            <span class="small text-body-secondary">Hi，{{ authState.user.name }}</span>
            <button class="btn btn-outline-dark btn-sm" type="button" @click="onLogout">登出</button>
          </template>
          <template v-else-if="authState.ready">
            <RouterLink class="btn btn-outline-dark btn-sm" :to="{ name: 'login' }">登入</RouterLink>
            <RouterLink class="btn btn-dark btn-sm" :to="{ name: 'register' }">註冊</RouterLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>
