<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http, { errorMessage } from '../api/http';
import { authState } from '../stores/auth';
import { addToCart } from '../stores/cart';
import { showToast } from '../stores/toast';
import { formatPrice } from '../utils/format';
import StatusMessage from '../components/StatusMessage.vue';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const related = ref([]);
const status = ref('loading'); // loading | ready | notfound | error
const error = ref('');
const qty = ref(1);
const adding = ref(false);

async function load() {
  status.value = 'loading';
  qty.value = 1;
  related.value = [];
  try {
    const { data } = await http.get(`/products/${route.params.id}`);
    product.value = data.product;
    status.value = 'ready';
    loadRelated();
  } catch (err) {
    const code = err?.response?.status;
    status.value = code === 404 || code === 400 ? 'notfound' : 'error';
    error.value = errorMessage(err, '商品載入失敗');
  }
}
watch(() => route.params.id, load, { immediate: true });

// 同分類推薦：失敗就不顯示，不影響主要內容
async function loadRelated() {
  try {
    const { data } = await http.get('/products', { params: { category: product.value.category.slug, limit: 5 } });
    related.value = data.products.filter((p) => p.id !== product.value.id).slice(0, 4);
  } catch {
    related.value = [];
  }
}

function changeQty(delta) {
  const next = qty.value + delta;
  if (next >= 1 && next <= product.value.stock) qty.value = next;
}

async function onAdd() {
  if (!authState.user) {
    showToast('請先登入才能加入購物車', 'warning');
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  if (!Number.isInteger(qty.value) || qty.value < 1) {
    showToast('數量必須是 1 以上的整數', 'error');
    return;
  }
  adding.value = true;
  try {
    await addToCart(product.value.id, qty.value);
    showToast(`已將「${product.value.name}」× ${qty.value} 加入購物車`);
  } catch (err) {
    showToast(errorMessage(err, '加入購物車失敗'), 'error');
  } finally {
    adding.value = false;
  }
}
</script>

<template>
  <div class="container-gz py-4 py-lg-5">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb small">
        <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
        <li class="breadcrumb-item"><RouterLink to="/products">所有商品</RouterLink></li>
        <li v-if="product && status === 'ready'" class="breadcrumb-item">
          <RouterLink :to="{ name: 'products', query: { category: product.category.slug } }">{{ product.category.name }}</RouterLink>
        </li>
        <li v-if="product && status === 'ready'" class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
      </ol>
    </nav>

    <StatusMessage v-if="status === 'loading'" type="loading" message="商品載入中…" />
    <StatusMessage v-else-if="status === 'notfound'" type="empty" message="找不到這個商品，可能已經下架了">
      <RouterLink class="btn btn-outline-dark btn-sm" to="/products">回商品列表</RouterLink>
    </StatusMessage>
    <StatusMessage v-else-if="status === 'error'" type="error" :message="error" @retry="load" />

    <template v-else>
      <article class="row g-4 g-lg-5">
        <div class="col-lg-7">
          <div class="product-frame ratio ratio-1x1">
            <img :src="product.imageUrl" :alt="product.name" class="product-img" />
          </div>
        </div>

        <div class="col-lg-5">
          <div class="sticky-lg-top" style="top: 1.5rem; z-index: 1">
            <p class="text-body-secondary mb-2">
              <RouterLink class="link-secondary" :to="{ name: 'products', query: { category: product.category.slug } }">{{ product.category.name }}</RouterLink>
            </p>
            <h1 class="section-title mb-3">{{ product.name }}</h1>
            <p class="fs-3 fw-medium mb-4">{{ formatPrice(product.price) }}</p>

            <div class="band-soft rounded-3 p-4">
              <p v-if="product.stock === 0" class="text-danger fw-medium mb-0">目前缺貨</p>
              <form v-else @submit.prevent="onAdd">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <label for="qty" class="fw-medium">數量</label>
                  <span class="small text-body-secondary">庫存 {{ product.stock }} 件</span>
                </div>
                <!-- 窄螢幕放不下就換行：「加入購物車」掉到下一行、整排寬 -->
                <div class="d-flex flex-wrap gap-2">
                  <div class="input-group flex-nowrap flex-shrink-0" style="width: 150px">
                    <button class="btn btn-light qty-btn" type="button" aria-label="減少數量" :disabled="qty <= 1" @click="changeQty(-1)">−</button>
                    <input id="qty" v-model.number="qty" type="number" min="1" :max="product.stock" class="form-control text-center bg-white border-white px-1" />
                    <button class="btn btn-light qty-btn" type="button" aria-label="增加數量" :disabled="qty >= product.stock" @click="changeQty(1)">+</button>
                  </div>
                  <button class="btn btn-dark btn-lg flex-grow-1 text-nowrap" style="min-width: 11rem" type="submit" :disabled="adding">
                    <span v-if="adding" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    {{ adding ? '加入中…' : '加入購物車' }}
                  </button>
                </div>
              </form>
            </div>

            <ul class="list-unstyled small text-body-secondary mt-3 mb-0 d-grid gap-1">
              <li>登入會員即可加入購物車，購物車會保存在帳號裡</li>
              <li>本站為專題作品，未開放結帳與配送</li>
            </ul>

            <div id="productInfo" class="accordion accordion-flush mt-4">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button px-0 fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#info-desc" aria-expanded="true" aria-controls="info-desc">商品描述</button>
                </h2>
                <div id="info-desc" class="accordion-collapse collapse show">
                  <p class="accordion-body px-0 pt-0" style="white-space: pre-line">{{ product.description }}</p>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed px-0 fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#info-spec" aria-expanded="false" aria-controls="info-spec">商品資訊</button>
                </h2>
                <div id="info-spec" class="accordion-collapse collapse">
                  <dl class="accordion-body px-0 pt-0 row mb-0">
                    <dt class="col-4 fw-normal text-body-secondary">分類</dt>
                    <dd class="col-8">{{ product.category.name }}</dd>
                    <dt class="col-4 fw-normal text-body-secondary">商品編號</dt>
                    <dd class="col-8">GZ-{{ product.id }}</dd>
                    <dt class="col-4 fw-normal text-body-secondary">庫存</dt>
                    <dd class="col-8 mb-0">{{ product.stock }} 件</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <section v-if="related.length" class="pt-5 mt-lg-5" aria-labelledby="related-title">
        <h2 v-reveal id="related-title" class="section-title mb-4">同分類的其他選物</h2>
        <div class="row row-cols-2 row-cols-md-4 g-3 g-lg-4">
          <div v-for="(p, i) in related" :key="p.id" v-reveal="i * 70" class="col">
            <ProductCard :product="p" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
