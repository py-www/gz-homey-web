<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login } from '../stores/auth';
import { fetchCart } from '../stores/cart';
import { showToast } from '../stores/toast';
import { errorMessage } from '../api/http';
import { EMAIL_RE, safeRedirect } from '../utils/validators';

const route = useRoute();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });
const serverError = ref('');
const submitting = ref(false);

function validate() {
  errors.email = EMAIL_RE.test(form.email.trim()) ? '' : '請輸入正確的 Email';
  errors.password = form.password ? '' : '請輸入密碼';
  return !errors.email && !errors.password;
}

async function onSubmit() {
  serverError.value = '';
  if (!validate()) return;
  submitting.value = true;
  try {
    await login(form.email.trim(), form.password);
    await fetchCart();
    showToast('登入成功，歡迎回來！');
    router.push(safeRedirect(route.query.redirect));
  } catch (err) {
    serverError.value = errorMessage(err, '登入失敗，請再試一次');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="auth" aria-labelledby="login-title">
    <div class="auth-photo">
      <img src="/images/login.jpg" alt="" width="1320" height="752" />
    </div>
    <div class="auth-sheet">
      <h1 id="login-title" class="section-title mb-2">會員登入<span class="en title-en">Sign in</span></h1>
      <p class="text-body-secondary mb-4">登入後，購物車會跟著你的帳號。</p>
      <form novalidate @submit.prevent="onSubmit">
        <div v-if="serverError" class="alert alert-danger py-2" role="alert">{{ serverError }}</div>
        <div class="mb-3">
          <label for="login-email" class="form-label">Email</label>
          <input id="login-email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" autocomplete="email" />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
        <div class="mb-4">
          <label for="login-password" class="form-label">密碼</label>
          <input id="login-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="current-password" />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <button class="btn btn-dark btn-lg w-100" type="submit" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          {{ submitting ? '登入中…' : '登入' }}
        </button>
        <p class="mt-4 mb-0">
          還沒有帳號？
          <RouterLink :to="{ name: 'register', query: route.query }">立即註冊</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>
