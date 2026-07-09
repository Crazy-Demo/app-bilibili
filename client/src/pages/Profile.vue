<template>
  <AppLayout>
    <div v-if="isLogin && user">
      <UserInfo :user="user" />
      <MenuList />
    </div>
    <EmptyState v-else message="请先登录" />
  </AppLayout>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import AppLayout from '../components/layout/AppLayout.vue'
import UserInfo from '../components/profile/UserInfo.vue'
import MenuList from '../components/profile/MenuList.vue'
import EmptyState from '../components/common/EmptyState.vue'

const { isLogin, user } = useAuth()
onMounted(async () => {
  const { useAuthStore } = await import('../stores/auth')
  useAuthStore().fetchMe()
})
</script>
