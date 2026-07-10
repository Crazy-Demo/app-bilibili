<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名"
        :rules="[{ required: true, message: '请输入用户名' }]" />
      <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' } as any]" />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit" :loading="loading">登录</van-button>
    </div>
  </van-form>
</template>
<script setup lang="ts">
import { ref } from 'vue'; import { showToast } from 'vant'
const props = defineProps<{ onLogin: (username: string, password: string) => Promise<void> }>()
const username = ref(''); const password = ref(''); const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try { await props.onLogin(username.value, password.value) }
  catch { showToast('登录失败') }
  finally { loading.value = false }
}
</script>
