// 所有 API 都走這個 axios 實例：自動加上 baseURL 和登入 token
import axios from 'axios';

export const TOKEN_KEY = 'gzhomey_token';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  timeout: 60000, // Render 免費方案冷啟動可能要 30–60 秒
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 把 axios 錯誤轉成給使用者看的一句話（後端錯誤格式：{ ok:false, message }）
export function errorMessage(err, fallback = '發生錯誤，請稍後再試') {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ECONNABORTED') return '伺服器回應太久，請稍後重新整理';
  if (err?.request && !err?.response) return '無法連線到伺服器，請確認網路或稍後再試';
  return fallback;
}

export default http;
