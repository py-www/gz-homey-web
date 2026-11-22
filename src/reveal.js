// v-reveal：元素捲進畫面時淡入上移；v-reveal="120" 代表延遲 120ms（做依序進場）
// 隱藏狀態只寫在 CSS 的 prefers-reduced-motion: no-preference 裡，沒有 JS 或關閉動畫時內容照常顯示
const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              io.unobserve(e.target);
            }
          }),
        { rootMargin: '0px 0px -8% 0px' },
      )
    : null;

if (io) document.documentElement.classList.add('reveal-on');

export default {
  mounted(el, { value }) {
    el.setAttribute('data-reveal', '');
    if (value) el.style.setProperty('--d', `${value}ms`);
    if (io) io.observe(el);
  },
  unmounted(el) {
    io?.unobserve(el);
  },
};
