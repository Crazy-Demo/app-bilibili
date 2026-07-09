<template>
  <div class="login-page">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" fixed placeholder />
    <Brand />
    <LoginForm :on-login="handleLogin" />
    <div class="agreement">
      <van-checkbox v-model="agreed" icon-size="14px">
        我已阅读并同意 <span class="link">《用户协议》</span>和<span class="link">《隐私政策》</span>
      </van-checkbox>
    </div>
    <SocialLoginBar />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'; import { showToast } from 'vant'
import { useAuth } from '../composables/useAuth'
import Brand from '../components/login/Brand.vue'
import LoginForm from '../components/login/LoginForm.vue'
import SocialLoginBar from '../components/login/SocialLoginBar.vue'

const { login } = useAuth()
const agreed = ref(false)

async function handleLogin(username: string, password: string) {
  if (!agreed.value) { showToast('请先同意用户协议'); return }
  await login(username, password)
}
</script>
<style scoped>
.login-page { background:var(--bg-white); min-height:100vh; }
.agreement { padding:0 16px; display:flex; justify-content:center; }
.link { color:var(--pink-primary); }
</style>
