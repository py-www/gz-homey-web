<script setup>
import { ref, onMounted } from 'vue';
import http, { errorMessage } from '../api/http';
import ProductCard from '../components/ProductCard.vue';
import StatusMessage from '../components/StatusMessage.vue';

const categories = ref([]);
const featured = ref([]);
const status = ref('loading'); // loading | ready | error
const error = ref('');

async function load() {
  status.value = 'loading';
  try {
    const [cats, prods] = await Promise.all([http.get('/categories'), http.get('/products', { params: { limit: 8 } })]);
    categories.value = cats.data.categories;
    featured.value = prods.data.products;
    status.value = 'ready';
  } catch (err) {
    error.value = errorMessage(err, '資料載入失敗');
    status.value = 'error';
  }
}
onMounted(load);
</script>

<template>
  <div class="container-gz pt-2">
    <section class="hero d-flex align-items-start" aria-labelledby="hero-title">
      <div class="p-4 p-md-5" style="max-width: 760px">
        <h1 id="hero-title" class="hero-title mb-4" lang="en">Made for<br />cozy living</h1>
        <p class="fs-5 mb-4" style="max-width: 26rem">
          香氛、燈光、織品與小擺飾，幫你挑好了。小預算，也能住出好氛圍。
        </p>
        <RouterLink class="btn btn-light btn-lg d-inline-flex align-items-center gap-2" to="/products">
          開始逛逛
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
        </RouterLink>
      </div>
    </section>
  </div>

  <StatusMessage v-if="status === 'loading'" type="loading" message="載入中…（第一次開啟可能需要等伺服器喚醒）" class="container-gz" />
  <StatusMessage v-else-if="status === 'error'" type="error" :message="error" class="container-gz" @retry="load" />

  <template v-else>
    <section class="container-gz pt-5 mt-lg-5" aria-labelledby="cat-title">
      <div class="band-sage p-4 p-md-5">
        <div class="row g-4 align-items-end mb-4">
          <div class="col-lg-6">
            <h2 id="cat-title" class="section-title mb-2">依分類逛</h2>
            <p class="mb-0 fs-5 opacity-75">從一盞燈、一顆蠟燭開始，慢慢把房間變成你的。</p>
          </div>
        </div>
        <div class="row row-cols-2 row-cols-md-4 g-3">
          <div v-for="c in categories" :key="c.id" class="col">
            <RouterLink :to="{ name: 'products', query: { category: c.slug } }" class="product-card text-white">
              <div class="product-frame ratio ratio-4x3">
                <img :src="`https://picsum.photos/seed/gzhomey-cat-${c.slug}/600/450`" :alt="c.name" class="product-img" loading="lazy" />
              </div>
              <h3 class="fs-5 fw-normal mt-3 mb-0">{{ c.name }} <span aria-hidden="true">→</span></h3>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-gz py-5 my-lg-5" aria-labelledby="featured-title">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <h2 id="featured-title" class="section-title mb-0">新品上架</h2>
        <RouterLink to="/products" class="link-dark link-offset-2">看全部商品 →</RouterLink>
      </div>
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4">
        <div v-for="p in featured" :key="p.id" class="col">
          <ProductCard :product="p" />
        </div>
      </div>
    </section>
  </template>
</template>
