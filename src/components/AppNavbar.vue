<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '../api/http';
import { authState, logout } from '../stores/auth';
import { cartState, clearCart } from '../stores/cart';
import { showToast } from '../stores/toast';
import { CATEGORY_LABEL } from '../utils/categories';

const route = useRoute();
const router = useRouter();

const categories = ref([]);
const keyword = ref('');

// 搜尋框跟著網址的 ?q= 走（在商品頁重新整理也會保留文字）
watch(
  () => route.query.q,
  (q) => {
    keyword.value = typeof q === 'string' ? q : '';
  },
  { immediate: true },
);

function onSearch() {
  const q = keyword.value.trim();
  router.push({ name: 'products', query: q ? { q } : {} });
}

function isActive(slug) {
  return route.name === 'products' && (route.query.category || '') === slug;
}

function onLogout() {
  logout();
  clearCart();
  showToast('已登出');
  router.push({ name: 'home' });
}

onMounted(async () => {
  try {
    const { data } = await http.get('/categories');
    categories.value = data.categories;
  } catch {
    categories.value = []; // 分類列載入失敗時只留「所有商品」
  }
});
</script>

<template>
  <header class="site-header">
    <p class="topbar small text-center mb-0 py-2 px-3">本站為六角學院專題作品，商品僅供展示，未開放結帳</p>

    <div class="container-gz py-3">
      <div class="d-flex flex-wrap align-items-center gap-3">
        <RouterLink class="brand fs-3 text-reset text-decoration-none me-auto me-md-0" to="/">GZ HOMEY</RouterLink>

        <form class="header-search position-relative flex-grow-1 order-last order-md-0 mx-md-auto" role="search" @submit.prevent="onSearch">
          <label for="site-search" class="visually-hidden">搜尋商品</label>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input id="site-search" v-model="keyword" type="search" class="form-control" placeholder="搜尋商品，例如：木、蠟燭" />
        </form>

        <div class="d-flex align-items-center gap-1">
          <template v-if="authState.user">
            <span class="small text-body-secondary d-none d-lg-inline me-1">Hi，{{ authState.user.name }}</span>
            <button class="btn btn-link btn-sm text-reset" type="button" @click="onLogout">登出</button>
          </template>
          <RouterLink v-else-if="authState.ready" class="icon-btn d-inline-flex" :to="{ name: 'login' }" aria-label="會員登入">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </RouterLink>
          <button
            class="btn icon-btn position-relative"
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
            <span v-if="cartState.totalQuantity" class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-dark">
              {{ cartState.totalQuantity }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <nav class="cat-bar" aria-label="商品分類">
      <ul class="container-gz list-unstyled d-flex column-gap-4 column-gap-lg-5 mb-0">
        <li>
          <RouterLink :to="{ name: 'products' }" :class="{ 'is-active': isActive('') }">所有商品<span class="en">All</span></RouterLink>
        </li>
        <li v-for="c in categories" :key="c.id">
          <RouterLink :to="{ name: 'products', query: { category: c.slug } }" :class="{ 'is-active': isActive(c.slug) }">
            {{ CATEGORY_LABEL[c.slug]?.zh ?? c.name }}<span v-if="CATEGORY_LABEL[c.slug]" class="en">{{ CATEGORY_LABEL[c.slug].en }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
