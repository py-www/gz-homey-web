import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // 啟用 data-bs-* 互動（Navbar 收合、Offcanvas）
import './assets/main.css';
import './assets/theme-warm.css';
import App from './App.vue';
import router from './router';
import reveal from './reveal';
import { restoreSession } from './stores/auth';
import { fetchCart } from './stores/cart';

// 主題切換：預設暖色系；?theme=default 可切回黑白，記在 localStorage
const THEME_KEY = 'gzhomey_theme';
const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme === 'warm' || urlTheme === 'default') localStorage.setItem(THEME_KEY, urlTheme);
document.documentElement.dataset.theme = localStorage.getItem(THEME_KEY) || 'warm';

createApp(App).use(router).directive('reveal', reveal).mount('#app');
restoreSession().then(fetchCart); // 先確認登入，再拿購物車
