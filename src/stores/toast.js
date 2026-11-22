// 全站共用的 Toast 提示：任何地方呼叫 showToast('訊息') 就會跳出來
import { reactive } from 'vue';

export const toastState = reactive({ items: [] });
let nextId = 0;

export function showToast(message, type = 'success', duration = 2500) {
  nextId += 1;
  const id = nextId;
  toastState.items.push({ id, message, type });
  setTimeout(() => {
    const index = toastState.items.findIndex((t) => t.id === id);
    if (index !== -1) toastState.items.splice(index, 1);
  }, duration);
}
