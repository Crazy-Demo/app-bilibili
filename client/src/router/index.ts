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
    path: '/video/:bvid/comment/:rpid', name: 'comment-detail',
    component: () => import('../pages/CommentDetail.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/video/:bvid/fullscreen', name: 'fullplayer',
    component: () => import('../pages/FullPlayer.vue'),
    meta: { transition: 'fade', requiresAuth: false },
  },
  {
    path: '/video/:bvid/desc', name: 'videodesc',
    component: () => import('../pages/VideoDesc.vue'),
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
    path: '/user/:uid', name: 'user',
    component: () => import('../pages/UPProfile.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/settings', name: 'settings',
    component: () => import('../pages/Settings.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/search', name: 'search',
    component: () => import('../pages/Search.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/dynamic', name: 'dynamic',
    component: () => import('../pages/Dynamic.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/channel', name: 'channel',
    component: () => import('../pages/Channel.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../pages/Notification.vue'),
    meta: { transition: 'slide-left', requiresAuth: true },
  },
  {
    path: '/upload', name: 'upload',
    component: () => import('../pages/Upload.vue'),
    meta: { transition: 'slide-left', requiresAuth: true },
  },
  {
    path: '/mall', name: 'mall',
    component: () => import('../pages/Mall.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/live/:roomId', name: 'live',
    component: () => import('../pages/LiveStream.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/vip', name: 'vip',
    component: () => import('../pages/VIP.vue'),
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
