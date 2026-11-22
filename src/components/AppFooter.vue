<template>
  <footer class="site-footer mt-5 pt-5 pb-4">
    <div class="container-gz">
      <div class="row g-4 mb-5">
        <div class="col-md-6">
          <p class="fs-5 text-white mb-2">讓家有氛圍的小物選品</p>
          <p class="mb-0" style="max-width: 28rem">香氛蠟燭、燈具、織品與生活擺飾，幫你挑好了，小預算也能佈置出有質感的房間。</p>
        </div>
        <div class="col-6 col-md-3">
          <h2 class="fs-6 text-white mb-3">逛逛</h2>
          <ul class="list-unstyled d-grid gap-2 mb-0">
            <li><RouterLink class="link-light link-underline-opacity-0 link-underline-opacity-100-hover" to="/">首頁</RouterLink></li>
            <li><RouterLink class="link-light link-underline-opacity-0 link-underline-opacity-100-hover" to="/products">所有商品</RouterLink></li>
          </ul>
        </div>
        <div class="col-6 col-md-3">
          <h2 class="fs-6 text-white mb-3">會員</h2>
          <ul class="list-unstyled d-grid gap-2 mb-0">
            <li><RouterLink class="link-light link-underline-opacity-0 link-underline-opacity-100-hover" :to="{ name: 'login' }">登入</RouterLink></li>
            <li><RouterLink class="link-light link-underline-opacity-0 link-underline-opacity-100-hover" :to="{ name: 'register' }">註冊</RouterLink></li>
          </ul>
        </div>
      </div>
      <p class="footer-wordmark mb-4" aria-hidden="true">GZ HOMEY</p>
      <div class="d-flex flex-column flex-md-row justify-content-between gap-1 small">
        <p class="mb-0">© 2026 GZ HOMEY · 六角學院專題作品，非真實商店</p>
        <p class="mb-0">首頁照片：“Elegant &amp; cozy home interior”, CC0, via rawpixel</p>
      </div>
    </div>
  </footer>
</template>
