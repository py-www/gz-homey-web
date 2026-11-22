import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // 啟用 data-bs-* 互動（Navbar 收合、Offcanvas）
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { restoreSession } from './stores/auth';

createApp(App).use(router).mount('#app');
restoreSession(); // 重新整理後用 token 拿回使用者
