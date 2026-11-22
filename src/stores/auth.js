// 登入狀態：token 存 localStorage，使用者資料放在 authState.user
import { reactive } from 'vue';
import http, { TOKEN_KEY } from '../api/http';

// ready = 已經確認過登入狀態（避免重新整理時 Navbar 先閃一下「登入」按鈕）
export const authState = reactive({ user: null, ready: false });

function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  authState.user = user;
}

export async function login(email, password) {
  const { data } = await http.post('/auth/login', { email, password });
  saveSession(data);
}

export async function register({ name, email, password }) {
  const { data } = await http.post('/auth/register', { name, email, password });
  saveSession(data);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  authState.user = null;
}

// 重新整理頁面時呼叫：有 token 就用 /auth/me 拿回使用者
export async function restoreSession() {
  if (!localStorage.getItem(TOKEN_KEY)) {
    authState.ready = true;
    return;
  }
  try {
    const { data } = await http.get('/auth/me');
    authState.user = data.user;
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 404) logout(); // token 過期或帳號不存在才清掉；網路錯誤先保留
  } finally {
    authState.ready = true;
  }
}
