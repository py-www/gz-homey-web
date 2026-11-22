<script setup>
import { ref, onMounted } from 'vue';
import http, { errorMessage } from '../api/http';
import { authState } from '../stores/auth';
import ProductCard from '../components/ProductCard.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { CATEGORY_LABEL } from '../utils/categories';

const categories = ref([]);
const featured = ref([]);
const total = ref(0);
const activeSlug = ref(''); // 分類清單目前亮起的那一列，左邊照片跟著換
const status = ref('loading'); // loading | ready | error
const error = ref('');

// shortcut: 分類情境照先用 picsum 精選室內照（Unsplash 授權），有自己的分類照片後換掉
const CAT_PHOTO = { candles: 225, lighting: 311, textiles: 625, decor: 305 };
const catImg = (slug) => `https://picsum.photos/id/${CAT_PHOTO[slug] ?? 24}/800/1000`;

async function load() {
  status.value = 'loading';
  try {
    const [cats, prods] = await Promise.all([http.get('/categories'), http.get('/products', { params: { limit: 8 } })]);
    categories.value = cats.data.categories;
    featured.value = prods.data.products;
    total.value = prods.data.pagination?.total ?? 0;
    activeSlug.value = categories.value[0]?.slug ?? '';
    status.value = 'ready';
  } catch (err) {
    error.value = errorMessage(err, '資料載入失敗');
    status.value = 'error';
  }
}
onMounted(load);
</script>

<template>
  <section class="stage" aria-labelledby="hero-title">
    <div class="stage-photo">
      <!-- shortcut: hero 先用 picsum 精選室內照（Unsplash 授權），有自己的淺色情境照後換掉 -->
      <img src="https://picsum.photos/id/625/1200/1500" alt="白天的餐廳：木桌、白色椅子與大片窗光" width="1200" height="1500" fetchpriority="high" />
      <p class="stage-bar mb-0">
        <span>香氛蠟燭、燈具、織品、擺飾</span>
        <span v-if="total">{{ total }} 件選物</span>
      </p>
    </div>
    <div class="stage-sheet">
      <h1 id="hero-title" class="stage-title">為家留一點<br />氛圍</h1>
      <p class="stage-lead">一盞燈、一顆蠟燭、一條毯子。我們把居家小物挑好了，小預算也能住出好氛圍。</p>
      <RouterLink class="btn btn-dark btn-lg" to="/products">逛逛全部商品</RouterLink>
    </div>
  </section>

  <StatusMessage v-if="status === 'loading'" type="loading" message="載入中…（第一次開啟可能需要等伺服器喚醒）" class="container-gz" />
  <StatusMessage v-else-if="status === 'error'" type="error" :message="error" class="container-gz" @retry="load" />

  <template v-else>
    <section class="container-gz pick" aria-labelledby="cat-title">
      <div class="pick-photo">
        <img v-for="c in categories" :key="c.id" :src="catImg(c.slug)" :alt="c.slug === activeSlug ? c.name : ''" :class="{ 'is-on': c.slug === activeSlug }" loading="lazy" width="800" height="1000" />
      </div>
      <div class="pick-body">
        <h2 v-reveal id="cat-title" class="section-title mb-3">依分類逛<span class="en title-en">Shop by Category</span></h2>
        <p v-reveal="80" class="mb-4" style="max-width: 30rem">從一盞燈、一顆蠟燭開始，慢慢把房間變成你的。</p>
        <nav class="pick-list" aria-label="商品分類">
          <RouterLink
            v-for="(c, i) in categories"
            :key="c.id"
            v-reveal="120 + i * 70"
            :to="{ name: 'products', query: { category: c.slug } }"
            :class="{ 'is-on': c.slug === activeSlug }"
            @mouseenter="activeSlug = c.slug"
            @focus="activeSlug = c.slug"
          >
            {{ c.name }}<span class="en">{{ CATEGORY_LABEL[c.slug]?.en ?? '' }} →</span>
          </RouterLink>
        </nav>
      </div>
    </section>

    <section class="field-dark py-5" aria-labelledby="featured-title">
      <div class="container-gz py-lg-5">
        <div class="d-flex justify-content-between align-items-end mb-4 gap-3">
          <h2 v-reveal id="featured-title" class="section-title mb-0">新品上架<span class="en title-en">New Arrivals</span></h2>
          <RouterLink v-reveal="80" to="/products" class="link-offset-2 text-nowrap">看全部商品 →</RouterLink>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4 row-gap-5">
          <div v-for="(p, i) in featured" :key="p.id" v-reveal="(i % 4) * 70" class="col">
            <ProductCard :product="p" />
          </div>
        </div>
      </div>
    </section>

    <section class="field-soft py-5" aria-labelledby="member-title">
      <div class="container-gz py-5 d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
        <div v-reveal>
          <h2 id="member-title" class="section-title mb-3">登入後，購物車幫你記著<span class="en title-en">Members</span></h2>
          <p class="mb-0" style="max-width: 32rem">購物車存在會員帳號裡，換手機、換電腦打開，挑好的東西都還在。</p>
        </div>
        <div v-reveal="100" class="d-flex flex-wrap gap-2 flex-shrink-0">
          <RouterLink v-if="authState.user" class="btn btn-dark btn-lg" to="/products">繼續逛逛</RouterLink>
          <template v-else>
            <RouterLink class="btn btn-dark btn-lg" :to="{ name: 'register' }">免費註冊</RouterLink>
            <RouterLink class="btn btn-outline-dark btn-lg" :to="{ name: 'login' }">登入</RouterLink>
          </template>
        </div>
      </div>
    </section>
  </template>
</template>
