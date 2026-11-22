import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue') },
  { path: '/products/:id', name: 'product', component: () => import('../views/ProductDetailView.vue') },
  // 之後的 Task 在這行上面加新路由
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  // 按瀏覽器返回時回到原本捲動的位置。商品列表是非同步載入，要等列表畫出來（gz:list-ready）才捲，
  // 不然頁面還只有「載入中」那麼高，捲不到原位；最多等 5 秒（Render 冷啟動時就放棄、停在頂端附近）
  scrollBehavior(to, from, saved) {
    if (!saved) return { top: 0 };
    if (to.name !== 'products') return saved;
    return new Promise((resolve) => {
      const done = () => {
        clearTimeout(timer);
        window.removeEventListener('gz:list-ready', done);
        resolve(saved);
      };
      const timer = setTimeout(done, 5000);
      window.addEventListener('gz:list-ready', done);
    });
  },
});
