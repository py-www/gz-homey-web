// 購物車狀態：所有變更都打後端，後端回傳完整購物車後直接覆蓋 → 前後端永遠一致
import { reactive } from 'vue';
import http, { TOKEN_KEY, errorMessage } from '../api/http';
import { showToast } from './toast';

export const cartState = reactive({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  busyId: null, // 正在更新的商品 id（按鈕暫時 disabled，避免連點）
});

function apply(data) {
  cartState.items = data.items;
  cartState.totalQuantity = data.totalQuantity;
  cartState.totalPrice = data.totalPrice;
}

export function clearCart() {
  apply({ items: [], totalQuantity: 0, totalPrice: 0 });
}

export async function fetchCart() {
  if (!localStorage.getItem(TOKEN_KEY)) {
    clearCart();
    return;
  }
  cartState.loading = true;
  try {
    const { data } = await http.get('/cart');
    apply(data);
  } catch (err) {
    showToast(errorMessage(err, '購物車載入失敗'), 'error');
  } finally {
    cartState.loading = false;
  }
}

// 失敗時 throw，讓頁面決定要顯示什麼
export async function addToCart(productId, quantity = 1) {
  const { data } = await http.post('/cart', { productId, quantity });
  apply(data);
}

export async function updateCartItem(productId, quantity) {
  cartState.busyId = productId;
  try {
    const { data } = await http.patch(`/cart/${productId}`, { quantity });
    apply(data);
  } catch (err) {
    showToast(errorMessage(err, '更新數量失敗'), 'error');
    await fetchCart(); // 失敗就重新拿一次，確保畫面和後端一致
  } finally {
    cartState.busyId = null;
  }
}

export async function removeCartItem(productId) {
  cartState.busyId = productId;
  try {
    const { data } = await http.delete(`/cart/${productId}`);
    apply(data);
    showToast('已從購物車移除');
  } catch (err) {
    showToast(errorMessage(err, '移除失敗'), 'error');
    await fetchCart();
  } finally {
    cartState.busyId = null;
  }
}
