import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // 啟用 data-bs-* 互動（Navbar 收合、Offcanvas）
import './assets/main.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
