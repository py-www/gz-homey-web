<script setup>
import { ref, computed, onMounted } from 'vue';
import http, { errorMessage } from '../api/http';
import { authState } from '../stores/auth';
import ProductCard from '../components/ProductCard.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { CATEGORY_LABEL } from '../utils/categories';

const categories = ref([]);
const featured = ref([]);
const total = ref(0);
const status = ref('loading'); // loading | ready | error
const error = ref('');

// 分類照放在 public/images/cat-<slug>.jpg（candles / lighting / textiles / decor）
// shortcut: 只有這 4 個分類有照片，後端新增分類時要補一張同名照片，不然會破圖
const catImg = (slug) => `/images/cat-${slug}.jpg`;

// 精選系列：取前三個分類，第一個大圖、後兩個疊在右邊
const collections = computed(() => categories.value.slice(0, 3));
// 商品數量來自後端，同一份資料前 4 件當「精選」、後 4 件當「新品」橫向捲動
const picks = computed(() => featured.value.slice(0, 4));
const arrivals = computed(() => featured.value.slice(4));

const scroller = ref(null);
const slide = (dir) => scroller.value?.scrollBy({ left: dir * scroller.value.clientWidth * 0.8, behavior: 'smooth' });

async function load() {
  status.value = 'loading';
  try {
    const [cats, prods] = await Promise.all([http.get('/categories'), http.get('/products', { params: { limit: 8 } })]);
    categories.value = cats.data.categories;
    featured.value = prods.data.products;
    total.value = prods.data.pagination?.total ?? 0;
    status.value = 'ready';
  } catch (err) {
    error.value = errorMessage(err, '資料載入失敗');
    status.value = 'error';
  }
}
onMounted(load);
</script>

<template>
  <!-- 1. Hero：滿版照片＋左下文字 -->
  <section class="hero-full" aria-labelledby="hero-title">
    <img src="/images/hero.jpg" alt="夕陽暖光的客廳：米白色 L 型沙發、木頭圓桌與搖椅" width="800" height="600" fetchpriority="high" />
    <div class="container-gz hero-full-body">
      <p class="eyebrow mb-3">香氛蠟燭・燈具・織品・擺飾<span v-if="total">　{{ total }} 件選物</span></p>
      <h1 id="hero-title" class="stage-title">為家留一點<br />氛圍</h1>
      <p class="hero-full-lead">一盞燈、一顆蠟燭、一條毯子。我們把居家小物挑好了，小預算也能住出好氛圍。</p>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink class="btn btn-light btn-lg" to="/products">逛逛全部商品</RouterLink>      </div>
    </div>
  </section>

  <StatusMessage v-if="status === 'loading'" type="loading" message="載入中…（第一次開啟可能需要等伺服器喚醒）" class="container-gz" />
  <StatusMessage v-else-if="status === 'error'" type="error" :message="error" class="container-gz" @retry="load" />

  <template v-else>
    <!-- 精選系列：一大兩小（原本上面的「依分類逛」已拿掉，之後改成「依空間逛」） -->
    <section v-if="collections.length" class="container-gz home-sec" aria-label="精選系列">
      <div class="coll-grid">
        <RouterLink
          v-for="(c, i) in collections"
          :key="c.id"
          v-reveal="i * 80"
          :to="{ name: 'products', query: { category: c.slug } }"
          :class="['coll-card', { 'coll-card-lg': i === 0 }]"
        >
          <img :src="catImg(c.slug)" alt="" loading="lazy" />
          <div class="coll-card-txt">
            <p class="eyebrow mb-2">{{ i === 0 ? '本季精選' : 'Collection' }}</p>
            <h3 class="coll-card-title">{{ c.name }}<span class="en">{{ CATEGORY_LABEL[c.slug]?.en ?? '' }}</span></h3>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 4. 精選商品 -->
    <section class="container-gz home-sec pt-0" aria-labelledby="picks-title">
      <div class="sec-head">
        <h2 v-reveal id="picks-title" class="section-title mb-0">店長推薦<span class="en title-en">Our Picks</span></h2>
        <RouterLink v-reveal="80" to="/products" class="link-offset-2 text-nowrap">看全部商品 →</RouterLink>
      </div>
      <div class="row row-cols-2 row-cols-lg-4 g-3 g-lg-4 row-gap-5">
        <div v-for="(p, i) in picks" :key="p.id" v-reveal="i * 70" class="col"><ProductCard :product="p" /></div>
      </div>
    </section>

    <!-- 5. 編輯專欄：兩張照片＋文字 -->
    <section class="field-soft home-sec" aria-labelledby="edit-title">
      <div class="container-gz edit-grid">
        <div v-reveal class="edit-imgs">
          <img class="edit-img-a" src="/images/edit-a.jpg" alt="" loading="lazy" />
          <img class="edit-img-b" src="/images/edit-b.jpg" alt="" loading="lazy" />
        </div>
        <div v-reveal="100">
          <p class="eyebrow mb-3">Journal・居家提案</p>
          <h2 id="edit-title" class="section-title mb-4">慢下來的夜晚，<br />從一盞燈開始</h2>
          <p class="mb-4" style="max-width: 30rem">把主燈關掉，留一盞桌燈、點一顆蠟燭，再鋪上一條毯子。三件小物，就能讓房間的氣氛完全不同。</p>
          <blockquote class="edit-quote">「好的空間不是塞滿，而是留一點位置給生活。」</blockquote>
          <RouterLink class="btn btn-dark btn-lg" :to="{ name: 'products', query: { category: 'lighting' } }">看燈具</RouterLink>
        </div>
      </div>
    </section>

    <!-- 6. 新品上架：橫向捲動 -->
    <section v-if="arrivals.length" class="container-gz home-sec" aria-labelledby="new-title">
      <div class="sec-head">
        <h2 v-reveal id="new-title" class="section-title mb-0">新品上架<span class="en title-en">New Arrivals</span></h2>
        <div class="d-flex gap-2">
          <button type="button" class="round-btn" aria-label="上一組" @click="slide(-1)">←</button>
          <button type="button" class="round-btn" aria-label="下一組" @click="slide(1)">→</button>
        </div>
      </div>
      <div ref="scroller" class="h-scroll">
        <div v-for="p in arrivals" :key="p.id" class="h-scroll-item"><ProductCard :product="p" /></div>
      </div>
    </section>

    <!-- 7. 品牌故事 -->
    <section class="container-gz home-sec pt-0 text-center" aria-labelledby="story-title">
      <p v-reveal class="eyebrow mb-3">About GZ HOMEY</p>
      <h2 v-reveal="60" id="story-title" class="section-title mx-auto mb-4" style="max-width: 18em">從室內設計工作室出發，挑選能用很久的居家小物</h2>
      <p v-reveal="120" class="mx-auto text-body-secondary" style="max-width: 36rem">十年室內設計經驗讓我們知道，好的空間是慢慢累積的。每一件選物都先放進真實的家裡試用，才會出現在這裡。</p>
      <div class="story-stats">
        <div><b>10+</b><span>年室內設計經驗</span></div>
        <div><b>{{ categories.length }}</b><span>個生活分類</span></div>
        <div><b>{{ total }}</b><span>件精選商品</span></div>
      </div>
    </section>

    <!-- 8. 會員（取代 newsletter：註冊 / 登入是真的會動的功能） -->
    <section class="field-soft home-sec member-band" aria-labelledby="member-title">
      <div class="container-gz d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
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
