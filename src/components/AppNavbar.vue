<script setup>
import { useRouter } from 'vue-router';
import { authState, logout } from '../stores/auth';
import { showToast } from '../stores/toast';

const router = useRouter();

function onLogout() {
  logout();
  showToast('已登出');
  router.push({ name: 'home' });
}
</script>

<template>
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-md container-gz" aria-label="主選單">
      <RouterLink class="navbar-brand brand fs-5" to="/">GZ HOMEY</RouterLink>
      <!-- CART_BUTTON：Task 4 在這裡加購物車按鈕 -->
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
        <div class="d-flex align-items-center gap-2 py-2 py-md-0">
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
