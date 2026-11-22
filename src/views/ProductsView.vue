<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http, { errorMessage } from '../api/http';
import ProductCard from '../components/ProductCard.vue';
import PaginationNav from '../components/PaginationNav.vue';
import StatusMessage from '../components/StatusMessage.vue';

const route = useRoute();
const router = useRouter();

const categories = ref([]);
const products = ref([]);
const pagination = ref({ page: 1, totalPages: 1, total: 0 });
const status = ref('loading'); // loading | ready | error
const error = ref('');
const keyword = ref('');

// 篩選條件都放在網址上：重新整理、分享連結都會保留
const currentCategory = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''));
const currentQ = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''));
const currentPage = computed(() => {
  const n = Number(route.query.page);
  return Number.isInteger(n) && n > 0 ? n : 1;
});
const currentCategoryName = computed(
  () => categories.value.find((c) => c.slug === currentCategory.value)?.name || '所有商品',
);

// 改條件時（除非指定 page）一律回到第 1 頁
function updateQuery(patch) {
  const next = { category: currentCategory.value, q: currentQ.value, page: undefined, ...patch };
  const query = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined && v !== '' && v !== 1));
  router.push({ name: 'products', query });
}

let requestId = 0; // 連續快速點擊時，只採用最後一次的結果
async function loadProducts() {
  requestId += 1;
  const myId = requestId;
  status.value = 'loading';
  try {
    const { data } = await http.get('/products', {
      params: {
        page: currentPage.value,
        limit: 8,
        category: currentCategory.value || undefined,
        q: currentQ.value || undefined,
      },
    });
    if (myId !== requestId) return;
    products.value = data.products;
    pagination.value = data.pagination;
    status.value = 'ready';
  } catch (err) {
    if (myId !== requestId) return;
    error.value = errorMessage(err, '商品載入失敗');
    status.value = 'error';
  }
}

async function loadCategories() {
  try {
    const { data } = await http.get('/categories');
    categories.value = data.categories;
  } catch {
    categories.value = []; // 分類載入失敗不擋商品列表
  }
}

watch(
  () => route.query,
  () => {
    keyword.value = currentQ.value;
    loadProducts();
  },
  { immediate: true },
);
onMounted(loadCategories);
</script>

<template>
  <section class="container-gz py-5">
    <h1 class="section-title mb-4">{{ currentCategoryName }}</h1>

    <div class="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center mb-4">
      <nav aria-label="商品分類" class="overflow-auto">
        <ul class="nav nav-pills flex-nowrap text-nowrap">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: !currentCategory }" type="button" @click="updateQuery({ category: '' })">全部</button>
          </li>
          <li v-for="c in categories" :key="c.id" class="nav-item">
            <button class="nav-link" :class="{ active: currentCategory === c.slug }" type="button" @click="updateQuery({ category: c.slug })">
              {{ c.name }}
            </button>
          </li>
        </ul>
      </nav>

      <form class="d-flex gap-2" role="search" style="max-width: 360px" @submit.prevent="updateQuery({ q: keyword.trim() })">
        <label for="product-search" class="visually-hidden">搜尋商品</label>
        <input id="product-search" v-model="keyword" type="search" class="form-control" placeholder="搜尋商品，例如：木、蠟燭" />
        <button class="btn btn-dark text-nowrap" type="submit">搜尋</button>
      </form>
    </div>

    <p v-if="status === 'ready' && currentQ" class="text-muted small">
      「{{ currentQ }}」的搜尋結果：共 {{ pagination.total }} 件
    </p>

    <StatusMessage v-if="status === 'loading'" type="loading" message="商品載入中…（第一次開啟可能需要等伺服器喚醒）" />
    <StatusMessage v-else-if="status === 'error'" type="error" :message="error" @retry="loadProducts" />
    <StatusMessage v-else-if="products.length === 0" type="empty" message="查無符合條件的商品">
      <button class="btn btn-outline-dark btn-sm" type="button" @click="router.push({ name: 'products' })">清除篩選條件</button>
    </StatusMessage>

    <template v-else>
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4">
        <div v-for="p in products" :key="p.id" class="col">
          <ProductCard :product="p" />
        </div>
      </div>
      <PaginationNav :page="pagination.page" :total-pages="pagination.totalPages" @change="(p) => updateQuery({ page: p })" />
    </template>
  </section>
</template>
