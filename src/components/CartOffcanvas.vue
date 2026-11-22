<script setup>
import { useRouter } from 'vue-router';
import { Offcanvas } from 'bootstrap';
import { authState } from '../stores/auth';
import { cartState, updateCartItem, removeCartItem } from '../stores/cart';
import { formatPrice } from '../utils/format';

const router = useRouter();

// 先關掉側欄再換頁
function goTo(to) {
  Offcanvas.getOrCreateInstance(document.getElementById('cartOffcanvas')).hide();
  router.push(to);
}
</script>

<template>
  <aside id="cartOffcanvas" class="offcanvas offcanvas-end" style="--bs-offcanvas-bg: var(--gz-bg)" tabindex="-1" aria-labelledby="cartOffcanvasLabel">
    <div class="offcanvas-header">
      <h2 id="cartOffcanvasLabel" class="offcanvas-title fs-3 mb-0">購物車<span class="en fs-6 ms-2">Cart</span></h2>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="關閉購物車"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column">
      <div v-if="!authState.user" class="text-center my-auto">
        <p class="mb-3">登入後才能使用購物車</p>
        <button class="btn btn-dark" type="button" @click="goTo({ name: 'login' })">前往登入</button>
      </div>

      <div v-else-if="cartState.loading && cartState.items.length === 0" class="text-center my-auto" role="status">
        <div class="spinner-border text-secondary" aria-hidden="true"></div>
        <p class="mt-2 text-muted">購物車載入中…</p>
      </div>

      <div v-else-if="cartState.items.length === 0" class="text-center my-auto">
        <p class="mb-3">購物車是空的</p>
        <button class="btn btn-dark" type="button" @click="goTo({ name: 'products' })">去逛逛</button>
      </div>

      <template v-else>
        <ul class="list-unstyled flex-grow-1 mb-3">
          <li v-for="item in cartState.items" :key="item.productId" class="cart-item">
            <img :src="item.product.imageUrl" :alt="item.product.name" width="76" height="95" />
            <div class="min-w-0">
              <button class="btn btn-link p-0 text-reset text-start text-decoration-none fw-medium" type="button" @click="goTo({ name: 'product', params: { id: item.productId } })">
                {{ item.product.name }}
              </button>
              <p class="small text-body-secondary mb-2">{{ formatPrice(item.product.price) }}</p>
              <span v-if="!item.product.isActive" class="small text-danger">已下架，請移除</span>
              <div v-else class="qty">
                <button type="button" aria-label="減少數量" :disabled="item.quantity <= 1 || cartState.busyId === item.productId" @click="updateCartItem(item.productId, item.quantity - 1)">−</button>
                <output aria-live="polite" :aria-label="`數量 ${item.quantity}`">{{ item.quantity }}</output>
                <button type="button" aria-label="增加數量" :disabled="item.quantity >= item.product.stock || cartState.busyId === item.productId" @click="updateCartItem(item.productId, item.quantity + 1)">+</button>
              </div>
            </div>
            <div class="text-end d-flex flex-column justify-content-between">
              <span class="fw-medium">{{ formatPrice(item.subtotal) }}</span>
              <button class="btn btn-link p-0 small text-body-secondary" type="button" :disabled="cartState.busyId === item.productId" @click="removeCartItem(item.productId)">移除</button>
            </div>
          </li>
        </ul>
        <div class="cart-total">
          <div class="d-flex justify-content-between mb-1">
            <span>商品數量</span><span>{{ cartState.totalQuantity }} 件</span>
          </div>
          <div class="d-flex justify-content-between fs-4 fw-medium">
            <span>合計</span><span>{{ formatPrice(cartState.totalPrice) }}</span>
          </div>
          <p class="small text-body-secondary mt-2 mb-0">本站為專題作品，未開放結帳。</p>
        </div>
      </template>
    </div>
  </aside>
</template>
