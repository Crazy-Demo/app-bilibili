import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const store = useAuthStore()

  async function login(username: string, password: string) {
    await store.login(username, password)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }

  async function logout() {
    await store.logout()
    router.push('/')
  }

  return { login, logout, isLogin: store.isLogin, user: store.user }
}
