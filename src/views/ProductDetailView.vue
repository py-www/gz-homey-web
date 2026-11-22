<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http, { errorMessage } from '../api/http';
import { authState } from '../stores/auth';
import { addToCart } from '../stores/cart';
import { showToast } from '../stores/toast';
import { formatPrice } from '../utils/format';
import StatusMessage from '../components/StatusMessage.vue';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const status = ref('loading'); // loading | ready | notfound | error
const error = ref('');
const qty = ref(1);
const adding = ref(false);

async function load() {
  status.value = 'loading';
  qty.value = 1;
  try {
    const { data } = await http.get(`/products/${route.params.id}`);
    product.value = data.product;
    status.value = 'ready';
  } catch (err) {
    const code = err?.response?.status;
    status.value = code === 404 || code === 400 ? 'notfound' : 'error';
    error.value = errorMessage(err, '商品載入失敗');
  }
}
watch(() => route.params.id, load, { immediate: true });

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
  <section class="container-gz py-5">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb small">
        <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
        <li class="breadcrumb-item"><RouterLink to="/products">所有商品</RouterLink></li>
        <li v-if="product && status === 'ready'" class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
      </ol>
    </nav>

    <StatusMessage v-if="status === 'loading'" type="loading" message="商品載入中…" />
    <StatusMessage v-else-if="status === 'notfound'" type="empty" message="找不到這個商品，可能已經下架了">
      <RouterLink class="btn btn-outline-dark btn-sm" to="/products">回商品列表</RouterLink>
    </StatusMessage>
    <StatusMessage v-else-if="status === 'error'" type="error" :message="error" @retry="load" />

    <article v-else class="row g-4 g-lg-5">
      <div class="col-md-6">
        <div class="product-frame ratio ratio-1x1">
          <img :src="product.imageUrl" :alt="product.name" class="product-img" />
        </div>
      </div>
      <div class="col-md-6 d-flex flex-column">
        <p class="text-muted mb-1">
          <RouterLink class="text-reset" :to="{ name: 'products', query: { category: product.category.slug } }">{{ product.category.name }}</RouterLink>
        </p>
        <h1 class="section-title mb-3">{{ product.name }}</h1>
        <p class="fs-3 mb-3">{{ formatPrice(product.price) }}</p>
        <p class="mb-4" style="white-space: pre-line">{{ product.description }}</p>

        <p v-if="product.stock === 0" class="text-danger fw-medium">目前缺貨</p>
        <template v-else>
          <p class="small text-muted mb-2">庫存 {{ product.stock }} 件</p>
          <form class="d-flex gap-2" @submit.prevent="onAdd">
            <label for="qty" class="visually-hidden">數量</label>
            <input id="qty" v-model.number="qty" type="number" min="1" :max="product.stock" class="form-control rounded-pill text-center" style="width: 96px" />
            <button class="btn btn-dark btn-lg flex-grow-1" type="submit" :disabled="adding">
              <span v-if="adding" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              {{ adding ? '加入中…' : '加入購物車' }}
            </button>
          </form>
        </template>
      </div>
    </article>
  </section>
</template>
