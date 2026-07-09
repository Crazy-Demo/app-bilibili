import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/', name: 'home',
    component: () => import('../pages/HomeFeed.vue'),
    meta: { transition: 'slide-right', requiresAuth: false },
  },
  {
    path: '/video/:bvid', name: 'video',
    component: () => import('../pages/VideoPlayer.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/login', name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/profile', name: 'profile',
    component: () => import('../pages/Profile.vue'),
    meta: { transition: 'slide-left', requiresAuth: true },
  },
  {
    path: '/search', name: 'search',
    component: () => import('../pages/Search.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*', name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
