<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { register } from '../stores/auth';
import { showToast } from '../stores/toast';
import { errorMessage } from '../api/http';
import { EMAIL_RE, safeRedirect } from '../utils/validators';

const route = useRoute();
const router = useRouter();

const form = reactive({ name: '', email: '', password: '', confirm: '' });
const errors = reactive({ name: '', email: '', password: '', confirm: '' });
const serverError = ref('');
const submitting = ref(false);

function validate() {
  const name = form.name.trim();
  errors.name = name && name.length <= 50 ? '' : '請輸入名稱（最多 50 字）';
  errors.email = EMAIL_RE.test(form.email.trim()) ? '' : '請輸入正確的 Email';
  errors.password = form.password.length >= 6 ? '' : '密碼至少 6 個字元';
  errors.confirm = form.confirm === form.password ? '' : '兩次輸入的密碼不一樣';
  return !errors.name && !errors.email && !errors.password && !errors.confirm;
}

async function onSubmit() {
  serverError.value = '';
  if (!validate()) return;
  submitting.value = true;
  try {
    await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    showToast('註冊成功，已自動登入！');
    router.push(safeRedirect(route.query.redirect));
  } catch (err) {
    serverError.value = errorMessage(err, '註冊失敗，請再試一次');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="container-gz py-5" style="max-width: 480px">
    <h1 class="section-title mb-4 text-center">建立帳號</h1>
    <form class="bg-white rounded-4 p-4 p-md-5" novalidate @submit.prevent="onSubmit">
      <div v-if="serverError" class="alert alert-danger py-2" role="alert">{{ serverError }}</div>
      <div class="mb-3">
        <label for="reg-name" class="form-label">名稱</label>
        <input id="reg-name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" autocomplete="name" />
        <div class="invalid-feedback">{{ errors.name }}</div>
      </div>
      <div class="mb-3">
        <label for="reg-email" class="form-label">Email</label>
        <input id="reg-email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" autocomplete="email" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="mb-3">
        <label for="reg-password" class="form-label">密碼</label>
        <input id="reg-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="new-password" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <div class="mb-4">
        <label for="reg-confirm" class="form-label">再輸入一次密碼</label>
        <input id="reg-confirm" v-model="form.confirm" type="password" class="form-control" :class="{ 'is-invalid': errors.confirm }" autocomplete="new-password" />
        <div class="invalid-feedback">{{ errors.confirm }}</div>
      </div>
      <button class="btn btn-dark w-100" type="submit" :disabled="submitting">
        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        {{ submitting ? '註冊中…' : '註冊' }}
      </button>
      <p class="text-center small mt-3 mb-0">
        已經有帳號？
        <RouterLink :to="{ name: 'login', query: route.query }">前往登入</RouterLink>
      </p>
    </form>
  </section>
</template>
