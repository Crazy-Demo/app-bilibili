import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth'
import type { UserProfile } from '../../../shared/types/user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const isLogin = computed(() => !!user.value)

  async function login(username: string, password: string) {
    const { data } = await authApi.login(username, password)
    user.value = data.user
  }

  async function logout() {
    try { await authApi.logout() } finally { user.value = null }
  }

  async function fetchMe() {
    try {
      const { data } = await authApi.getMe()
      user.value = data.user
    } catch { user.value = null }
  }

  return { user, isLogin, login, logout, fetchMe }
})
