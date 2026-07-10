<template>
  <van-cell-group inset>
    <van-cell title="创作中心" icon="edit" is-link />
    <van-cell title="我的收藏" icon="star-o" is-link />
    <van-cell title="观看历史" icon="clock-o" is-link />
    <van-cell title="稍后再看" icon="eye-o" is-link />
    <van-cell title="设置" icon="setting-o" is-link @click="$router.push('/settings')" />
  </van-cell-group>
  <div style="margin:16px">
    <van-button round block type="default" @click="handleLogout">退出登录</van-button>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
const { logout } = useAuth()
async function handleLogout() { await logout() }
</script>
