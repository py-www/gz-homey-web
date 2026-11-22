export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 登入後只允許跳回站內路徑，避免 ?redirect=https://壞網站
export function safeRedirect(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}
