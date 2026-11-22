<template>
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-md container-gz" aria-label="主選單">
      <RouterLink class="navbar-brand brand fs-5" to="/">GZ HOMEY</RouterLink>
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="切換選單"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="mainNav" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-auto gap-md-3">
          <li class="nav-item"><RouterLink class="nav-link" to="/">首頁</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/products">所有商品</RouterLink></li>
        </ul>
      </div>
    </nav>
  </header>
</template>
