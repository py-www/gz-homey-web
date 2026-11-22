// 價格顯示：1280 → "NT$ 1,280"
export const formatPrice = (n) => `NT$ ${Number(n).toLocaleString('zh-TW')}`;
