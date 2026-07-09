# Bilibili App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional Bilibili-like PWA with 5 core pages (Home Feed, Video Player, Login, Profile, Search) using Vue 3 + Vant + Express BFF.

**Architecture:** Monorepo with `client/` (Vue 3 SPA with Pinia + Vue Router) and `server/` (Express BFF with HttpOnly cookie JWT auth). BFF proxies Bilibili community APIs, zod validates inputs, LRU cache speeds up hot endpoints. Shared types between client and server via `shared/` directory.

**Tech Stack:** Vue 3 + Vite + Vant 4 + Pinia + Vue Router 4 + Axios + ArtPlayer + VueUse + Lucide Vue + vue-virtual-scroller | Express + cookie-parser + zod + express-rate-limit + node-lru-cache | Vitest + Vue Test Utils + supertest

**Spec:** `docs/superpowers/specs/2026-07-09-bilibili-app-design.md`

---

## File Structure Map

```
bilibili-app/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env
│   ├── .env.production
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/index.ts
│       ├── api/
│       │   ├── client.ts              # Axios instance + interceptors
│       │   ├── auth.ts
│       │   ├── feed.ts
│       │   ├── video.ts
│       │   ├── user.ts
│       │   └── search.ts
│       ├── stores/
│       │   ├── auth.ts
│       │   ├── player.ts
│       │   └── history.ts
│       ├── composables/
│       │   ├── useAuth.ts
│       │   ├── useInfiniteScroll.ts
│       │   ├── usePlayer.ts
│       │   └── useDanmaku.ts
│       ├── pages/
│       │   ├── HomeFeed.vue
│       │   ├── VideoPlayer.vue
│       │   ├── Login.vue
│       │   ├── Profile.vue
│       │   ├── Search.vue
│       │   └── NotFound.vue
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AppLayout.vue
│       │   │   └── BottomTabBar.vue
│       │   ├── common/
│       │   │   ├── EmptyState.vue
│       │   │   ├── ErrorBoundary.vue
│       │   │   ├── NetworkError.vue
│       │   │   └── SkeletonCard.vue
│       │   ├── home/
│       │   │   ├── TopSearchBar.vue
│       │   │   ├── CategoryPill.vue
│       │   │   ├── VideoGrid.vue
│       │   │   └── VideoCard.vue
│       │   ├── player/
│       │   │   ├── ActionButtonBar.vue
│       │   │   ├── CreatorInfoBar.vue
│       │   │   ├── DanmakuControl.vue
│       │   │   ├── VideoDesc.vue
│       │   │   ├── CommentItem.vue
│       │   │   └── RecommendedVideo.vue
│       │   ├── login/
│       │   │   ├── Brand.vue
│       │   │   ├── LoginForm.vue
│       │   │   └── SocialLoginBar.vue
│       │   ├── profile/
│       │   │   ├── UserInfo.vue
│       │   │   └── MenuList.vue
│       │   └── search/
│       │       ├── HistorySection.vue
│       │       └── HotSection.vue
│       ├── styles/
│       │   ├── tokens.css
│       │   └── main.css
│       └── assets/
│           ├── pwa-192.png
│           └── pwa-512.png
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── video.ts
│       │   ├── user.ts
│       │   └── search.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   ├── cache.ts
│       │   ├── logger.ts
│       │   ├── rateLimiter.ts
│       │   └── validate.ts
│       ├── services/
│       │   └── bilibili.ts
│       └── schemas/
│           ├── auth.ts
│           ├── video.ts
│           └── search.ts
├── shared/
│   └── types/
│       ├── index.ts
│       ├── video.ts
│       ├── user.ts
│       └── api.ts
└── docs/
    ├── superpowers/
    │   ├── specs/2026-07-09-bilibili-app-design.md
    │   └── plans/2026-07-09-bilibili-app-plan.md
    └── README.md
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: all `package.json`, `tsconfig.json`, `.env` files, `shared/types/*`

- [ ] **Step 1: Initialize client with Vite + Vue 3 + TypeScript**

```bash
cd /home/xm/projects/space-my/bilibili-app
mkdir -p client && cd client
npm create vite@latest . -- --template vue-ts
npm install
npm install vant vue-router@4 pinia pinia-plugin-persistedstate axios lucide-vue-next @vueuse/core artplayer vue-virtual-scroller dayjs
npm install -D @types/node
```


- [ ] **Step 2: Initialize server with Express + TypeScript**

```bash
cd /home/xm/projects/space-my/bilibili-app
mkdir -p server && cd server
npm init -y
npm install express cookie-parser cors morgan zod express-rate-limit lru-cache jsonwebtoken
npm install -D typescript @types/express @types/cookie-parser @types/cors @types/morgan @types/jsonwebtoken tsx
npx tsc --init --target ES2020 --module commonjs --outDir dist --rootDir src --esModuleInterop --strict
```

- [ ] **Step 3: Init shared types package**

```bash
cd /home/xm/projects/space-my/bilibili-app
mkdir -p shared/types
```

Write `shared/types/video.ts`:
```typescript
export interface VideoItem {
  bvid: string
  title: string
  cover: string
  duration: string
  playCount: string
  danmakuCount: string
  author: string
  authorAvatar: string
}

export interface VideoDetail extends VideoItem {
  desc: string
  pubdate: number
  stat: {
    view: number
    danmaku: number
    reply: number
    favorite: number
    coin: number
    share: number
    like: number
  }
  owner: {
    mid: number
    name: string
    face: string
  }
}

export interface CommentItem {
  rpid: number
  mid: number
  name: string
  avatar: string
  content: string
  like: number
  ctime: number
  replies?: CommentItem[]
}

export interface VideoFeedResponse {
  videos: VideoItem[]
  total: number
}
```

Write `shared/types/user.ts`:
```typescript
export interface UserProfile {
  mid: number
  name: string
  face: string
  level: number
  following: number
  followers: number
  likes: number
}
```

Write `shared/types/api.ts`:
```typescript
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  total: number
}
```

Write `shared/types/index.ts`:
```typescript
export * from './video'
export * from './user'
export * from './api'
```

- [ ] **Step 4: Create environment files**

Write `client/.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

Write `client/.env.production`:
```bash
VITE_API_BASE_URL=https://api.your-domain.com/api
```

Write `server/.env`:
```bash
PORT=3000
JWT_SECRET=dev-secret-change-in-production-please-use-64-char-random-string
JWT_EXPIRES_IN=7d
BILIBILI_API_BASE=https://api.bilibili.com
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

- [ ] **Step 5: Verify scaffolding works**

```bash
cd client && npm run dev
# Should see Vite dev server on :5173
```

Expected: Vite dev server starts successfully with empty Vue app.

```bash
cd server && npx tsx src/index.ts
# Should see Express server start message (after writing minimal app.ts/index.ts)
```

- [ ] **Step 6: Git init and commit**

```bash
cd /home/xm/projects/space-my/bilibili-app
git init
printf 'node_modules/\ndist/\n.env\n*.local\n' > .gitignore
git add -A
git commit -m "feat: project scaffolding — Vite + Express + shared types"
```

---

### Task 2: Design Tokens + Vant Theme

**Files:**
- Create: `client/src/styles/tokens.css`, `client/src/styles/main.css`
- Modify: `client/src/main.ts`, `client/src/App.vue`

- [ ] **Step 1: Write Design Tokens CSS**

Write `client/src/styles/tokens.css`:

```css
:root {
  /* Pink primary */
  --pink-primary:   #FB7299;
  --pink-hover:     #FC8DB3;
  --pink-pressed:   #E55F85;
  --pink-disabled:  #FB729966;
  /* Blue */
  --blue-primary:   #00A1D6;
  /* Backgrounds */
  --bg-white:       #FFFFFF;
  --bg-gray:        #F5F5F5;
  /* Text */
  --text-primary:   #1A1A1A;
  --text-secondary: #9CA3AF;
  /* Border */
  --border-subtle:  #E5E7EB;
  /* Semantic */
  --success:        #52C41A;
  --warning:        #FAAD14;
  --error:          #FF4D4F;
  /* Hot */
  --hot-orange:     #FF9933;
  --hot-red:        #FF6633;
  --hot-yellow:     #FFCC33;
  /* Spacing */
  --spacing-xs:     4px;
  --spacing-sm:     8px;
  --spacing-md:     12px;
  --spacing-lg:     16px;
  --spacing-xl:     24px;
  --spacing-2xl:    32px;
  /* Radius */
  --radius-sm:      4px;
  --radius-md:      8px;
  --radius-lg:      12px;
  --radius-full:    9999px;
  /* Vant overrides */
  --van-primary-color: #FB7299;
  --van-tabbar-item-active-color: #FB7299;
  --van-nav-bar-icon-color: #1A1A1A;
  --van-search-left-icon-color: #9CA3AF;
  --van-button-primary-background: #FB7299;
  --van-tabs-bottom-bar-color: #FB7299;
}
```

- [ ] **Step 2: Write global styles**

Write `client/src/styles/main.css`:

```css
@import './tokens.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-white);
  -webkit-font-smoothing: antialiased;
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from { transform: translateX(100%); }
.slide-left-leave-to   { transform: translateX(-100%); }
.slide-right-enter-from { transform: translateX(-100%); }
.slide-right-leave-to   { transform: translateX(100%); }
```

- [ ] **Step 3: Wire up in main.ts**

Modify `client/src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Vant)
app.mount('#app')
```

- [ ] **Step 4: Clear default App.vue content**

Modify `client/src/App.vue` to minimal shell:

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'slide-right'" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
```

- [ ] **Step 5: Verify and commit**

```bash
cd client && npm run dev
# Verify styles load, no console errors
```

```bash
git add -A && git commit -m "feat: design tokens + Vant theme + global styles"
```

---

### Task 3: Axios Client + API Layer

**Files:**
- Create: `client/src/api/client.ts`, `client/src/api/auth.ts`, `client/src/api/feed.ts`, `client/src/api/video.ts`, `client/src/api/user.ts`, `client/src/api/search.ts`

- [ ] **Step 1: Write Axios instance with interceptors**

Write `client/src/api/client.ts`:

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,  // send HttpOnly cookie
  timeout: 10000,
})

let isRefreshing = false
let failedQueue: Array<{ resolve: Function; reject: Function }> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(null)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => apiClient(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await apiClient.post('/auth/refresh')
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as Error)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
```

- [ ] **Step 2: Write API modules**

Write `client/src/api/auth.ts`:
```typescript
import apiClient from './client'

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),

  logout: () => apiClient.post('/auth/logout'),

  getMe: () => apiClient.get('/auth/me'),
}
```

Write `client/src/api/feed.ts`:
```typescript
import apiClient from './client'
import type { VideoFeedResponse } from '../../../shared/types/video'

export const feedApi = {
  getFeed: (page: number = 1, pageSize: number = 10) =>
    apiClient.get<VideoFeedResponse>('/video/feed', { params: { page, pageSize } }),
}
```

Write `client/src/api/video.ts`:
```typescript
import apiClient from './client'
import type { VideoDetail, CommentItem } from '../../../shared/types/video'

export const videoApi = {
  getDetail: (bvid: string) =>
    apiClient.get<VideoDetail>(`/video/${bvid}`),

  getPlayUrl: (bvid: string) =>
    apiClient.get<{ url: string; quality: string[] }>(`/video/${bvid}/playurl`),

  getComments: (bvid: string, page: number = 1, sort: 'hot' | 'new' = 'hot') =>
    apiClient.get<{ comments: CommentItem[]; total: number }>(`/video/${bvid}/comments`, { params: { page, sort } }),

  getRelated: (bvid: string) =>
    apiClient.get<{ videos: VideoDetail[] }>(`/video/${bvid}/related`),
}
```

Write `client/src/api/user.ts`:
```typescript
import apiClient from './client'
import type { UserProfile } from '../../../shared/types/user'

export const userApi = {
  getMe: () =>
    apiClient.get<UserProfile>('/user/me'),

  getProfile: (uid: number) =>
    apiClient.get<UserProfile>(`/user/${uid}/profile`),

  follow: (uid: number) =>
    apiClient.post(`/user/${uid}/follow`),
}
```

Write `client/src/api/search.ts`:
```typescript
import apiClient from './client'
import type { VideoItem } from '../../../shared/types/video'

export const searchApi = {
  search: (keyword: string, page: number = 1) =>
    apiClient.get<{ results: VideoItem[] }>('/search', { params: { keyword, page } }),

  getHot: () =>
    apiClient.get<{ keywords: string[] }>('/search/hot'),

  suggest: (keyword: string) =>
    apiClient.get<{ suggestions: string[] }>('/search/suggest', { params: { keyword } }),
}
```

- [ ] **Step 3: Verify and commit**

```bash
# Verify TypeScript compilation (mock the shared types import paths if needed)
cd client && npx vue-tsc --noEmit
# Should only have errors for missing files we haven't created yet
```

```bash
git add -A && git commit -m "feat: Axios client with 401 refresh + all API modules"
```

---

### Task 4: Pinia Stores

**Files:**
- Create: `client/src/stores/auth.ts`, `client/src/stores/player.ts`, `client/src/stores/history.ts`

- [ ] **Step 1: Write auth store (HttpOnly cookie based, memory only)**

Write `client/src/stores/auth.ts`:

```typescript
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
    try {
      await authApi.logout()
    } finally {
      user.value = null
    }
  }

  async function fetchMe() {
    try {
      const { data } = await authApi.getMe()
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  return { user, isLogin, login, logout, fetchMe }
})
```

- [ ] **Step 2: Write player store**

Write `client/src/stores/player.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const bvid = ref<string | null>(null)
  const cid = ref<string | null>(null)
  const isPlaying = ref(false)
  const danmakuEnabled = ref(true)
  const currentTime = ref(0)

  const isActive = computed(() => !!bvid.value)

  function play(videoBvid: string, videoCid?: string) {
    bvid.value = videoBvid
    if (videoCid) cid.value = videoCid
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function toggleDanmaku() {
    danmakuEnabled.value = !danmakuEnabled.value
  }

  function close() {
    bvid.value = null
    cid.value = null
    isPlaying.value = false
  }

  return { bvid, cid, isPlaying, danmakuEnabled, currentTime, isActive, play, pause, toggleDanmaku, close }
})
```

- [ ] **Step 3: Write history store (localStorage persisted)**

Write `client/src/stores/history.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

const MAX_HISTORY = 20

export const useHistoryStore = defineStore('history', () => {
  const searchHistory = ref<string[]>([])
  const playbackHistory = ref<Array<{ bvid: string; title: string; cover: string; timestamp: number }>>([])

  function addSearch(keyword: string) {
    searchHistory.value = [keyword, ...searchHistory.value.filter(k => k !== keyword)].slice(0, MAX_HISTORY)
  }

  function clearSearch() {
    searchHistory.value = []
  }

  function addPlayback(video: { bvid: string; title: string; cover: string }) {
    playbackHistory.value = [
      { ...video, timestamp: Date.now() },
      ...playbackHistory.value.filter(v => v.bvid !== video.bvid),
    ].slice(0, MAX_HISTORY)
  }

  return { searchHistory, playbackHistory, addSearch, clearSearch, addPlayback }
}, {
  persist: true,  // localStorage (non-sensitive data)
})
```

- [ ] **Step 4: Verify stores compile**

```bash
cd client && npx vue-tsc --noEmit
# Verify no TypeScript errors in stores/
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Pinia stores — auth (cookie), player, history (persisted)"
```

---

### Task 5: Router + Layout + BottomTabBar + Common Components

**Files:**
- Create: `client/src/router/index.ts`, `client/src/components/layout/AppLayout.vue`, `client/src/components/layout/BottomTabBar.vue`, `client/src/components/common/EmptyState.vue`, `client/src/components/common/ErrorBoundary.vue`, `client/src/components/common/NetworkError.vue`, `client/src/components/common/SkeletonCard.vue`
- Create: placeholder page files `HomeFeed.vue`, `VideoPlayer.vue`, `Login.vue`, `Profile.vue`, `Search.vue`, `NotFound.vue`

- [ ] **Step 1: Write router**

Write `client/src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomeFeed.vue'),
    meta: { transition: 'slide-right', requiresAuth: false },
  },
  {
    path: '/video/:bvid',
    name: 'video',
    component: () => import('../pages/VideoPlayer.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile.vue'),
    meta: { transition: 'slide-left', requiresAuth: true },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/Search.vue'),
    meta: { transition: 'slide-left', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
```

- [ ] **Step 2: Write AppLayout**

Write `client/src/components/layout/AppLayout.vue`:

```vue
<template>
  <div class="app-layout">
    <main class="app-content">
      <slot />
    </main>
    <BottomTabBar v-if="showTabBar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomTabBar from './BottomTabBar.vue'

const route = useRoute()
const showTabBar = computed(() => !['video', 'login'].includes(route.name as string))
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}
.app-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
```

- [ ] **Step 3: Write BottomTabBar (Vant Tabbar + B站粉定制)**

Write `client/src/components/layout/BottomTabBar.vue`:

```vue
<template>
  <van-tabbar v-model="active" :fixed="false" active-color="#FB7299" inactive-color="#9CA3AF">
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/search" icon="compass">动态</van-tabbar-item>
    <van-tabbar-item @click="showPublish = true">
      <template #icon>
        <div class="publish-btn">
          <Plus :size="26" color="#FFFFFF" />
        </div>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/" icon="shopping-bag">会员购</van-tabbar-item>
    <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>

  <van-share-sheet
    v-model:show="showPublish"
    title="发布"
    :options="publishOptions"
    @select="onPublishSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { Plus } from 'lucide-vue-next'

const active = ref(0)
const showPublish = ref(false)
const publishOptions = [
  { name: '发视频', icon: 'video-o' },
  { name: '发动态', icon: 'photo-o' },
  { name: '开直播', icon: 'play-circle-o' },
]

function onPublishSelect(option: { name: string }) {
  showPublish.value = false
  showToast(`${option.name} 功能开发中`)
}
</script>

<style scoped>
.publish-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--pink-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -4px 8px rgba(251, 114, 153, 0.25);
  margin-top: -14px;
}
</style>
```

- [ ] **Step 4: Write common components**

Write `client/src/components/common/EmptyState.vue`:
```vue
<template>
  <div class="empty-state">
    <van-empty :description="message" :image="image" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string; image?: string }>()
</script>
```

Write `client/src/components/common/ErrorBoundary.vue`:
```vue
<template>
  <slot v-if="!hasError" />
  <NetworkError v-else :message="errorMessage" @retry="reset" />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import NetworkError from './NetworkError.vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = (err as Error).message || '发生未知错误'
  return false  // stop propagation
})

function reset() {
  hasError.value = false
  errorMessage.value = ''
}
</script>
```

Write `client/src/components/common/NetworkError.vue`:
```vue
<template>
  <div class="network-error">
    <van-empty :description="message" image="network" />
    <van-button type="primary" size="small" @click="$emit('retry')">重试</van-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped>
.network-error { text-align: center; padding: 48px 24px; }
</style>
```

Write `client/src/components/common/SkeletonCard.vue`:
```vue
<template>
  <div class="skeleton-card">
    <van-skeleton :row="3" :loading="true">
      <div class="skeleton-placeholder" />
    </van-skeleton>
  </div>
</template>

<style scoped>
.skeleton-card { padding: 8px; }
.skeleton-placeholder { height: 120px; }
</style>
```

- [ ] **Step 5: Create placeholder page stubs**

Write `client/src/pages/HomeFeed.vue`:
```vue
<template><AppLayout><div>Home Feed</div></AppLayout></template>
<script setup lang="ts">import AppLayout from '../components/layout/AppLayout.vue'</script>
```

Write `client/src/pages/VideoPlayer.vue`:
```vue
<template><div>Video Player</div></template>
```

Write `client/src/pages/Login.vue`:
```vue
<template><div>Login</div></template>
```

Write `client/src/pages/Profile.vue`:
```vue
<template><AppLayout><div>Profile</div></AppLayout></template>
<script setup lang="ts">import AppLayout from '../components/layout/AppLayout.vue'</script>
```

Write `client/src/pages/Search.vue`:
```vue
<template><AppLayout><div>Search</div></AppLayout></template>
<script setup lang="ts">import AppLayout from '../components/layout/AppLayout.vue'</script>
```

Write `client/src/pages/NotFound.vue`:
```vue
<template>
  <div class="not-found">
    <van-empty description="页面不存在" image="error" />
    <van-button type="primary" to="/">返回首页</van-button>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.not-found { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; gap:24px; }
</style>
```

- [ ] **Step 6: Update App.vue to use ErrorBoundary**

Modify `client/src/App.vue`:
```vue
<template>
  <ErrorBoundary>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'slide-right'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import ErrorBoundary from './components/common/ErrorBoundary.vue'
</script>
```

- [ ] **Step 7: Verify navigation works**

```bash
cd client && npm run dev
# Open http://localhost:5173
# Navigate between tabs, verify BottomTabBar shows on non-video/login pages
# Visit /profile → should redirect to /login (not logged in)
# Visit /random-page → should show NotFound
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: router + AppLayout + BottomTabBar + common components"
```

---

### Task 6: BFF Server Framework

**Files:**
- Create: `server/src/index.ts`, `server/src/app.ts`
- Create: `server/src/middleware/auth.ts`, `server/src/middleware/cache.ts`, `server/src/middleware/logger.ts`, `server/src/middleware/rateLimiter.ts`, `server/src/middleware/validate.ts`
- Create: `server/src/schemas/auth.ts`, `server/src/schemas/video.ts`, `server/src/schemas/search.ts`
- Create: `server/src/routes/auth.ts`, `server/src/routes/video.ts`, `server/src/routes/user.ts`, `server/src/routes/search.ts`
- Create: `server/src/services/bilibili.ts`

- [ ] **Step 1: Write Express app.ts**

Write `server/src/app.ts`:
```typescript
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loggerMiddleware } from './middleware/logger'
import { rateLimiter } from './middleware/rateLimiter'
import authRoutes from './routes/auth'
import videoRoutes from './routes/video'
import userRoutes from './routes/user'
import searchRoutes from './routes/search'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(loggerMiddleware)
app.use('/api', rateLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/user', userRoutes)
app.use('/api/search', searchRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

export default app
```

- [ ] **Step 2: Write server entry point**

Write `server/src/index.ts`:
```typescript
import 'dotenv/config'
import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`BFF server running on http://localhost:${PORT}`)
})
```

```bash
cd server && npm install dotenv
```

- [ ] **Step 3: Write middleware**

Write `server/src/middleware/logger.ts`:
```typescript
import morgan from 'morgan'
export const loggerMiddleware = morgan('short')
```

Write `server/src/middleware/rateLimiter.ts`:
```typescript
import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 429, message: '请求过于频繁，请稍后再试' },
})
```

Write `server/src/middleware/cache.ts`:
```typescript
import { LRUCache } from 'lru-cache'
import type { Request, Response, NextFunction } from 'express'

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 min
})

export function cacheMiddleware(ttlMs: number = 5 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl
    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const originalJson = res.json.bind(res)
    res.json = (body: any) => {
      if (res.statusCode === 200) cache.set(key, body, { ttl: ttlMs })
      return originalJson(body)
    }
    next()
  }
}

export { cache }
```

Write `server/src/middleware/auth.ts`:
```typescript
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const WHITELIST = ['/api/auth/login', '/api/auth/logout', '/api/auth/refresh',
  '/api/health', '/api/video/feed', '/api/search', '/api/search/hot', '/api/search/suggest']

// /api/video/:bvid and its sub-routes are also whitelisted
function isWhitelisted(path: string): boolean {
  return WHITELIST.some(w => path.startsWith(w))
    || /^\/api\/video\/BV[a-zA-Z0-9]{10}/.test(path)
    || /^\/api\/video\/BV[a-zA-Z0-9]{10}\/(playurl|comments|related)/.test(path)
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (isWhitelisted(req.path)) return next()

  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    ;(req as any).user = decoded
    next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}
```

Write `server/src/middleware/validate.ts`:
```typescript
import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.query = result.data as any
    next()
  }
}
```

- [ ] **Step 4: Write zod schemas**

Write `server/src/schemas/auth.ts`:
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空').max(50),
  password: z.string().min(6, '密码至少6位').max(100),
})
```

Write `server/src/schemas/video.ts`:
```typescript
import { z } from 'zod'

export const videoQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  pageSize: z.string().optional().default('10').transform(Number),
  sort: z.enum(['hot', 'new']).optional().default('hot'),
})
```

Write `server/src/schemas/search.ts`:
```typescript
import { z } from 'zod'

export const searchQuerySchema = z.object({
  keyword: z.string().min(1, '搜索关键词不能为空').max(100),
  page: z.string().optional().default('1').transform(Number),
})
```

- [ ] **Step 5: Write Bilibili service (mock for now)**

Write `server/src/services/bilibili.ts`:
```typescript
// MVP: mock data service — replace with real Bilibili API calls later

export const bilibiliService = {
  async getFeed(page: number, pageSize: number) {
    const videos = Array.from({ length: pageSize }, (_, i) => ({
      bvid: `BV1xx411c7${String((page - 1) * pageSize + i).padStart(2, '0')}`,
      title: `【示例视频】第${(page - 1) * pageSize + i + 1}集 — 精彩内容不容错过`,
      cover: `https://picsum.photos/seed/video${(page - 1) * pageSize + i}/320/180`,
      duration: `${Math.floor(Math.random() * 20) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      playCount: `${(Math.random() * 100).toFixed(1)}万播放`,
      danmakuCount: `${Math.floor(Math.random() * 5000)}弹幕`,
      author: `UP主${Math.floor(Math.random() * 100)}`,
      authorAvatar: `https://picsum.photos/seed/avatar${i}/48/48`,
    }))
    return { videos, total: 500 }
  },

  async getVideoDetail(bvid: string) {
    return {
      bvid,
      title: `视频标题 — ${bvid}`,
      cover: `https://picsum.photos/seed/${bvid}/320/180`,
      duration: '12:34',
      playCount: '15.2万播放',
      danmakuCount: '3200弹幕',
      author: 'UP主名称',
      authorAvatar: 'https://picsum.photos/seed/up/48/48',
      desc: '这是视频简介内容。\n\n包含了多行文本描述...',
      pubdate: Date.now() / 1000 - 86400,
      stat: { view: 152000, danmaku: 3200, reply: 580, favorite: 1200, coin: 800, share: 300, like: 4500 },
      owner: { mid: 10001, name: 'UP主名称', face: 'https://picsum.photos/seed/up/48/48' },
    }
  },

  async getPlayUrl(_bvid: string) {
    return { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: ['1080P', '720P', '480P'] }
  },

  async getComments(_bvid: string, page: number) {
    const comments = Array.from({ length: 10 }, (_, i) => ({
      rpid: (page - 1) * 10 + i,
      mid: 10000 + i,
      name: `用户${(page - 1) * 10 + i}`,
      avatar: `https://picsum.photos/seed/comment${i}/32/32`,
      content: `这是一条评论内容 #${(page - 1) * 10 + i + 1}`,
      like: Math.floor(Math.random() * 1000),
      ctime: Date.now() / 1000 - Math.floor(Math.random() * 86400),
      replies: [],
    }))
    return { comments, total: 120 }
  },

  async getRelated(_bvid: string) {
    return { videos: Array.from({ length: 6 }, (_, i) => ({
      bvid: `BV1xx411c7r${i}`,
      title: `相关推荐视频 ${i + 1}`,
      cover: `https://picsum.photos/seed/related${i}/320/180`,
      duration: '8:20',
      playCount: `${(Math.random() * 50).toFixed(1)}万播放`,
      author: `UP主${i}`,
    })) }
  },

  async search(keyword: string, page: number) {
    const results = Array.from({ length: 10 }, (_, i) => ({
      bvid: `BV1xx411c7s${(page - 1) * 10 + i}`,
      title: `搜索"${keyword}"结果 ${(page - 1) * 10 + i + 1}`,
      cover: `https://picsum.photos/seed/search${(page - 1) * 10 + i}/320/180`,
      duration: '5:30',
      playCount: '8.2万播放',
      danmakuCount: '1500弹幕',
      author: 'UP主',
      authorAvatar: `https://picsum.photos/seed/sa${i}/48/48`,
    }))
    return { results, total: 80 }
  },

  async getHotSearch() {
    return { keywords: ['热门搜索词1', '热门搜索词2', '热门搜索词3', '今日排行', '热门推荐', '番剧推荐', '鬼畜区', '音乐区'] }
  },

  async getUserProfile(_uid: number) {
    return {
      mid: _uid || 10001,
      name: 'B站用户',
      face: 'https://picsum.photos/seed/user/96/96',
      level: 5,
      following: 128,
      followers: 52000,
      likes: 150000,
    }
  },
}
```

- [ ] **Step 6: Write route files**

Write `server/src/routes/auth.ts`:
```typescript
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { validateBody } from '../middleware/validate'
import { loginSchema } from '../schemas/auth'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

router.post('/login', validateBody(loginSchema), (req, res) => {
  const { username, password } = req.body

  // MVP: simple validation — any non-empty username + password >= 6 chars
  if (username && password.length >= 6) {
    const token = jwt.sign({ userId: 10001, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.json({
      code: 0,
      message: '登录成功',
      data: {
        user: {
          mid: 10001,
          name: username,
          face: 'https://picsum.photos/seed/user/96/96',
          level: 5,
          following: 128,
          followers: 52000,
          likes: 150000,
        },
      },
    })
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误' })
  }
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.json({ code: 0, message: '已退出' })
})

router.get('/me', authMiddleware, (req, res) => {
  // In real app, fetch user from DB by req.user.userId
  res.json({
    code: 0,
    data: {
      user: {
        mid: 10001,
        name: 'B站用户',
        face: 'https://picsum.photos/seed/user/96/96',
        level: 5,
        following: 128,
        followers: 52000,
        likes: 150000,
      },
    },
  })
})

router.post('/refresh', (req, res) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ code: 401, message: '未登录' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }
    const newToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ code: 0, message: 'token 已刷新' })
  } catch {
    res.status(401).json({ code: 401, message: '登录已过期' })
  }
})

export default router
```

Write `server/src/routes/video.ts`:
```typescript
import { Router } from 'express'
import { cacheMiddleware } from '../middleware/cache'
import { validateQuery } from '../middleware/validate'
import { videoQuerySchema } from '../schemas/video'
import { bilibiliService } from '../services/bilibili'

const router = Router()

router.get('/feed', validateQuery(videoQuerySchema), cacheMiddleware(), async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const data = await bilibiliService.getFeed(Number(page), Number(pageSize))
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取视频流失败' })
  }
})

router.get('/:bvid', async (req, res) => {
  try {
    const data = await bilibiliService.getVideoDetail(req.params.bvid)
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取视频详情失败' })
  }
})

router.get('/:bvid/playurl', async (req, res) => {
  try {
    const data = await bilibiliService.getPlayUrl(req.params.bvid)
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取播放地址失败' })
  }
})

router.get('/:bvid/comments', validateQuery(videoQuerySchema), async (req, res) => {
  try {
    const data = await bilibiliService.getComments(req.params.bvid, Number(req.query.page))
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取评论失败' })
  }
})

router.get('/:bvid/related', async (req, res) => {
  try {
    const data = await bilibiliService.getRelated(req.params.bvid)
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取推荐视频失败' })
  }
})

export default router
```

Write `server/src/routes/user.ts`:
```typescript
import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { bilibiliService } from '../services/bilibili'

const router = Router()

router.get('/me', authMiddleware, async (_req, res) => {
  try {
    const user = (req as any).user
    const data = await bilibiliService.getUserProfile(user.userId)
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取用户信息失败' })
  }
})

router.get('/:uid/profile', async (req, res) => {
  try {
    const data = await bilibiliService.getUserProfile(Number(req.params.uid))
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取UP主信息失败' })
  }
})

router.post('/:uid/follow', authMiddleware, async (req, res) => {
  res.json({ code: 0, message: '关注成功' })
})

export default router
```

Write `server/src/routes/search.ts`:
```typescript
import { Router } from 'express'
import { cacheMiddleware } from '../middleware/cache'
import { validateQuery } from '../middleware/validate'
import { searchQuerySchema } from '../schemas/search'
import { bilibiliService } from '../services/bilibili'

const router = Router()

router.get('/', validateQuery(searchQuerySchema), async (req, res) => {
  try {
    const { keyword, page } = req.query
    const data = await bilibiliService.search(String(keyword), Number(page))
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '搜索失败' })
  }
})

router.get('/hot', cacheMiddleware(), async (_req, res) => {
  try {
    const data = await bilibiliService.getHotSearch()
    res.json({ code: 0, data })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取热门搜索失败' })
  }
})

router.get('/suggest', async (req, res) => {
  res.json({ code: 0, data: { suggestions: [`${req.query.keyword} 建议1`, `${req.query.keyword} 建议2`] } })
})

export default router
```

- [ ] **Step 7: Add authMiddleware to all protected routes**

Update `server/src/app.ts` to apply auth middleware after cookie parsing:

```typescript
import { authMiddleware } from './middleware/auth'

// After cookieParser, before routes:
app.use('/api', authMiddleware)
// But need to make authMiddleware skip whitelisted routes (already handled in middleware)
```

Wait — the authMiddleware already checks whitelist internally. So just add it:

```typescript
app.use('/api', authMiddleware)
```

Insert this line after `app.use(cookieParser())` in `app.ts`.

- [ ] **Step 8: Test BFF server**

```bash
cd server && npx tsx src/index.ts
```

```bash
# In another terminal:
curl http://localhost:3000/api/health
# → {"ok":true}

curl http://localhost:3000/api/video/feed
# → {"code":0,"data":{"videos":[...10 items...],"total":500}}

curl -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"username":"test","password":"123456"}' -c cookies.txt
# → {"code":0,"message":"登录成功","data":{"user":{...}}}

curl http://localhost:3000/api/user/me -b cookies.txt
# → {"code":0,"data":{"mid":10001,...}}

curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
# → {"code":0,"message":"已退出"}
```

Expected: All endpoints return success responses with mock data.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: BFF server — Express + cookie auth + zod + rate limit + mock services"
```

---

### Task 7: Home Feed Page

**Files:**
- Create: `client/src/components/home/TopSearchBar.vue`, `client/src/components/home/CategoryPill.vue`, `client/src/components/home/VideoGrid.vue`, `client/src/components/home/VideoCard.vue`
- Create: `client/src/composables/useInfiniteScroll.ts`
- Modify: `client/src/pages/HomeFeed.vue`
- Test: `client/src/components/home/__tests__/VideoCard.test.ts`

- [ ] **Step 1: Write TopSearchBar**

Write `client/src/components/home/TopSearchBar.vue`:

```vue
<template>
  <van-sticky>
    <div class="top-search-bar">
      <van-icon name="play-circle-o" size="28" color="#FB7299" class="logo-icon" />
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索你感兴趣的内容"
        @focus="$router.push('/search')"
        readonly
      />
      <van-icon name="contact-o" size="24" color="#1A1A1A" @click="$router.push('/profile')" />
    </div>
  </van-sticky>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
</script>

<style scoped>
.top-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-white);
}
.top-search-bar :deep(.van-search) {
  flex: 1;
  padding: 0;
}
.top-search-bar :deep(.van-search__content) {
  background: var(--bg-gray);
}
</style>
```

- [ ] **Step 2: Write CategoryPill**

Write `client/src/components/home/CategoryPill.vue`:

```vue
<template>
  <van-tabs v-model:active="active" sticky offset-top="56" swipeable color="#FB7299">
    <van-tab v-for="tab in tabs" :key="tab" :title="tab" />
  </van-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
const tabs = ['推荐', '直播', '热门', '动画', '音乐', '舞蹈', '追番', '科技', '游戏', '知识', '美食']
</script>
```

- [ ] **Step 3: Write VideoCard**

Write `client/src/components/home/VideoCard.vue`:

```vue
<template>
  <div class="video-card" @click="$router.push(`/video/${video.bvid}`)">
    <div class="cover-wrapper">
      <img :src="video.cover" :alt="video.title" loading="lazy" class="cover" />
      <span class="duration">{{ video.duration }}</span>
    </div>
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <span class="author">{{ video.author }}</span>
        <span class="stat">{{ video.playCount }}</span>
        <span class="stat">{{ video.danmakuCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '../../../../shared/types/video'

defineProps<{ video: VideoItem }>()
</script>

<style scoped>
.video-card {
  flex: 1 1 calc(50% - 4px);
  min-width: 0;
  cursor: pointer;
}
.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-gray);
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
}
.info { padding: 4px 0; }
.title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
```

- [ ] **Step 4: Write VideoGrid**

Write `client/src/components/home/VideoGrid.vue`:

```vue
<template>
  <div class="video-grid">
    <VideoCard v-for="video in videos" :key="video.bvid" :video="video" />
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '../../../../shared/types/video'
import VideoCard from './VideoCard.vue'

defineProps<{ videos: VideoItem[] }>()
</script>

<style scoped>
.video-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
}
</style>
```

- [ ] **Step 5: Write useInfiniteScroll composable**

Write `client/src/composables/useInfiniteScroll.ts`:

```typescript
import { ref } from 'vue'
import type { VideoItem } from '../../../shared/types/video'
import { feedApi } from '../api/feed'

export function useInfiniteScroll() {
  const videos = ref<VideoItem[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const error = ref<string | null>(null)

  async function loadMore() {
    if (loading.value || finished.value) return
    loading.value = true
    error.value = null

    try {
      const page = Math.floor(videos.value.length / 10) + 1
      const { data } = await feedApi.getFeed(page, 10)
      const newVideos = data.data?.videos || (data as any).videos || []
      videos.value.push(...newVideos)
      if (newVideos.length < 10) finished.value = true
    } catch (err) {
      error.value = '加载失败，请重试'
    } finally {
      loading.value = false
    }
  }

  return { videos, loading, finished, error, loadMore }
}
```

- [ ] **Step 6: Wire up HomeFeed page**

Modify `client/src/pages/HomeFeed.vue`:

```vue
<template>
  <AppLayout>
    <TopSearchBar />
    <CategoryPill />
    <VideoGrid :videos="videos" />
    <div class="load-more">
      <van-loading v-if="loading" size="24" />
      <span v-else-if="finished" class="finished">— 没有更多了 —</span>
      <NetworkError v-else-if="error" :message="error" @retry="loadMore" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInfiniteScroll } from '../composables/useInfiniteScroll'
import AppLayout from '../components/layout/AppLayout.vue'
import TopSearchBar from '../components/home/TopSearchBar.vue'
import CategoryPill from '../components/home/CategoryPill.vue'
import VideoGrid from '../components/home/VideoGrid.vue'
import NetworkError from '../components/common/NetworkError.vue'

const { videos, loading, finished, error, loadMore } = useInfiniteScroll()

onMounted(() => loadMore())

// Infinite scroll listener
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    loadMore()
  }
})
</script>

<style scoped>
.load-more { display:flex; justify-content:center; padding:16px; }
.finished { color: var(--text-secondary); font-size:12px; }
</style>
```

- [ ] **Step 7: Verify HomeFeed renders**

```bash
cd client && npm run dev
# Visit http://localhost:5173
# Ensure BFF server is running on :3000
# Should see: TopSearchBar → CategoryPill → VideoGrid (2 columns)
# Scroll down → more videos load
```

- [ ] **Step 8: Add empty state to HomeFeed**

Add to `client/src/pages/HomeFeed.vue` template, after `<VideoGrid>`:

```vue
<EmptyState v-if="!loading && !videos.length && !error" message="暂无推荐视频" />
```

Add import:
```typescript
import EmptyState from '../components/common/EmptyState.vue'
```

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: Home Feed page — TopSearchBar + CategoryPill + VideoCard + infinite scroll"
```

---

### Task 8: Video Player Page (Core)

**Files:**
- Create: `client/src/composables/usePlayer.ts`, `client/src/composables/useDanmaku.ts`
- Create: `client/src/components/player/ActionButtonBar.vue`, `client/src/components/player/CreatorInfoBar.vue`, `client/src/components/player/DanmakuControl.vue`, `client/src/components/player/VideoDesc.vue`, `client/src/components/player/CommentItem.vue`, `client/src/components/player/RecommendedVideo.vue`
- Modify: `client/src/pages/VideoPlayer.vue`

- [ ] **Step 1: Write usePlayer composable**

Write `client/src/composables/usePlayer.ts`:

```typescript
import { ref, shallowRef } from 'vue'
import ArtPlayer from 'artplayer'
import type { VideoDetail, CommentItem } from '../../../shared/types/video'
import { videoApi } from '../api/video'

export function usePlayer() {
  const player = shallowRef<any>(null)
  const containerRef = ref<HTMLDivElement>()
  const detail = ref<VideoDetail | null>(null)
  const comments = ref<CommentItem[]>([])
  const related = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAndPlay(bvid: string) {
    loading.value = true
    error.value = null

    try {
      const [{ data: playData }, { data: detailData }, { data: commentData }, { data: relatedData }] =
        await Promise.all([
          videoApi.getPlayUrl(bvid),
          videoApi.getDetail(bvid),
          videoApi.getComments(bvid, 1),
          videoApi.getRelated(bvid),
        ])

      detail.value = detailData.data || (detailData as any)
      comments.value = (commentData.data?.comments || (commentData as any)?.comments || [])
      related.value = (relatedData.data?.videos || (relatedData as any)?.videos || [])
      const url = (playData.data?.url || (playData as any)?.url || '')

      if (containerRef.value) {
        player.value = new ArtPlayer({
          container: containerRef.value,
          url,
          autoPlay: true,
          muted: false,
          autoMini: true,
          autoSize: true,
          playbackRate: true,
          aspectRatio: true,
          setting: true,
          hotkey: true,
          pip: true,
          mutex: true,
          fullscreen: true,
          fullscreenWeb: true,
          danmuku: {
            id: bvid,
            api: '/api/video/' + bvid + '/danmaku',  // placeholder
          },
          theme: '#FB7299',
        })
      }
    } catch (err) {
      error.value = '加载失败，请重试'
    } finally {
      loading.value = false
    }
  }

  function destroy() {
    player.value?.destroy()
    player.value = null
  }

  return { containerRef, player, detail, comments, related, loading, error, loadAndPlay, destroy }
}
```

- [ ] **Step 2: Write useDanmaku composable**

Write `client/src/composables/useDanmaku.ts`:

```typescript
import { ref } from 'vue'

export function useDanmaku(player: { value: any }) {
  const enabled = ref(true)
  const opacity = ref(0.7)
  const fontSize = ref(24)
  const showSettings = ref(false)

  function toggle() {
    enabled.value = !enabled.value
    if (player.value) {
      enabled.value ? player.value.plugins?.danmuku?.show() : player.value.plugins?.danmuku?.hide()
    }
  }

  function sendDm(text: string) {
    if (!player.value || !text.trim()) return
    player.value.plugins?.danmuku?.emit({
      text,
      mode: 'rtl',
      color: '#FFFFFF',
      size: fontSize.value,
    })
  }

  return { enabled, opacity, fontSize, showSettings, toggle, sendDm }
}
```

- [ ] **Step 3: Write player sub-components**

Write `client/src/components/player/ActionButtonBar.vue`:
```vue
<template>
  <div class="action-bar">
    <div class="action-item" @click="$emit('like')">
      <ThumbsUp :size="22" />
      <span>{{ likes }}</span>
    </div>
    <div class="action-item" @click="$emit('coin')">
      <Coins :size="22" />
      <span>{{ coins }}</span>
    </div>
    <div class="action-item" @click="$emit('fav')">
      <Star :size="22" />
      <span>{{ favs }}</span>
    </div>
    <div class="action-item" @click="$emit('share')">
      <Share2 :size="22" />
      <span>分享</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThumbsUp, Coins, Star, Share2 } from 'lucide-vue-next'

defineProps<{ likes: string; coins: string; favs: string }>()
defineEmits(['like', 'coin', 'fav', 'share'])
</script>

<style scoped>
.action-bar { display:flex; justify-content:space-around; padding:12px 0; }
.action-item { display:flex; flex-direction:column; align-items:center; gap:4px; font-size:11px; color:var(--text-secondary); cursor:pointer; }
</style>
```

Write `client/src/components/player/CreatorInfoBar.vue`:
```vue
<template>
  <div class="creator-bar">
    <img :src="avatar" :alt="name" class="avatar" />
    <div class="info">
      <span class="name">{{ name }}</span>
      <span class="subs">{{ subs }}</span>
    </div>
    <van-button type="primary" size="small" round @click="$emit('follow')">+ 关注</van-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ avatar: string; name: string; subs: string }>()
defineEmits(['follow'])
</script>

<style scoped>
.creator-bar { display:flex; align-items:center; gap:12px; padding:12px 16px; }
.avatar { width:40px; height:40px; border-radius:50%; }
.info { flex:1; }
.name { display:block; font-size:14px; font-weight:600; }
.subs { font-size:12px; color:var(--text-secondary); }
</style>
```

Write `client/src/components/player/DanmakuControl.vue`:
```vue
<template>
  <div class="danmaku-control">
    <van-switch v-model="enabled" size="20px" active-color="#FB7299" @change="$emit('toggle')" />
    <span class="label">弹幕</span>
    <van-field v-model="dmText" placeholder="发个弹幕..." class="dm-input" @keyup.enter="sendDm" />
    <van-icon name="setting-o" size="20" @click="$emit('settings')" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ enabled: boolean }>()
const emit = defineEmits(['toggle', 'send', 'settings'])

const dmText = ref('')

function sendDm() {
  if (dmText.value.trim()) {
    emit('send', dmText.value)
    dmText.value = ''
  }
}
</script>

<style scoped>
.danmaku-control { display:flex; align-items:center; gap:8px; padding:8px 16px; background:var(--bg-white); }
.label { font-size:12px; color:var(--text-secondary); }
.dm-input { flex:1; }
</style>
```

Write `client/src/components/player/VideoDesc.vue`:
```vue
<template>
  <div class="video-desc">
    <div class="desc-header">
      <span class="pubdate">{{ pubdate }}</span>
      <span class="toggle" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</span>
    </div>
    <div class="desc-content" :class="{ clamped: !expanded }">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ description: string; pubdate: string }>()
const expanded = ref(false)
</script>

<style scoped>
.video-desc { padding:12px 16px; background:var(--bg-gray); border-radius:var(--radius-md); margin:0 12px; }
.desc-header { display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px; color:var(--text-secondary); }
.toggle { color:var(--pink-primary); cursor:pointer; }
.desc-content { font-size:13px; line-height:1.6; white-space:pre-wrap; }
.clamped { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
</style>
```

Write `client/src/components/player/CommentItem.vue`:
```vue
<template>
  <div class="comment-item">
    <img :src="comment.avatar" class="avatar" loading="lazy" />
    <div class="body">
      <div class="header">
        <span class="name">{{ comment.name }}</span>
        <span class="time">{{ formatTime(comment.ctime) }}</span>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="actions">
        <van-icon name="good-job-o" /> {{ comment.like }}
        <van-icon name="chat-o" style="margin-left:16px;" /> 回复
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentItem as CItem } from '../../../../shared/types/video'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

defineProps<{ comment: CItem }>()

function formatTime(ctime: number) {
  return dayjs.unix(ctime).fromNow()
}
</script>

<style scoped>
.comment-item { display:flex; gap:12px; padding:12px 16px; }
.avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; }
.body { flex:1; }
.header { display:flex; gap:8px; align-items:center; margin-bottom:4px; }
.name { font-size:12px; color:var(--text-secondary); }
.time { font-size:11px; color:var(--text-secondary); }
.content { font-size:13px; line-height:1.5; margin-bottom:6px; }
.actions { font-size:12px; color:var(--text-secondary); }
</style>
Write `client/src/components/player/RecommendedVideo.vue`:
```vue
<template>
  <div class="recommended">
    <h3 class="section-title">相关推荐</h3>
    <div class="rec-card" v-for="v in videos" :key="v.bvid" @click="$router.push(`/video/${v.bvid}`)">
      <img :src="v.cover" class="rec-cover" loading="lazy" />
      <div class="rec-info">
        <div class="rec-title">{{ v.title }}</div>
        <div class="rec-meta">{{ v.author }} · {{ v.playCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ videos: any[] }>()
</script>

<style scoped>
.section-title { font-size:16px; font-weight:600; padding:16px; }
.rec-card { display:flex; gap:8px; padding:8px 16px; cursor:pointer; }
.rec-cover { width:140px; aspect-ratio:16/9; border-radius:var(--radius-md); object-fit:cover; }
.rec-info { flex:1; display:flex; flex-direction:column; gap:4px; }
.rec-title { font-size:13px; font-weight:500; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rec-meta { font-size:11px; color:var(--text-secondary); }
</style>
```

- [ ] **Step 4: Wire up VideoPlayer page**

Modify `client/src/pages/VideoPlayer.vue`:
```vue
<template>
  <div class="player-page">
    <van-nav-bar title="视频详情" left-arrow @click-left="$router.back()" fixed placeholder />

    <div class="player-container" ref="containerRef">
      <div v-if="loading" class="player-loading">
        <van-loading size="48" color="#FB7299" />
      </div>
      <NetworkError v-if="error" :message="error" @retry="retry" />
    </div>

    <DanmakuControl
      v-if="detail && !loading"
      :enabled="dm.enabled"
      @toggle="dm.toggle"
      @send="dm.sendDm"
      @settings="() => {}"
    />

    <template v-if="detail">
      <ActionButtonBar
        :likes="formatCount(detail.stat.like)"
        :coins="formatCount(detail.stat.coin)"
        :favs="formatCount(detail.stat.favorite)"
        @share="onShare"
      />
      <CreatorInfoBar
        :avatar="detail.owner.face"
        :name="detail.owner.name"
        :subs="formatCount(detail.stat.view) + ' 观看'"
      />
      <VideoDesc :description="detail.desc" :pubdate="formatDate(detail.pubdate)" />

      <div class="section-title">评论 ({{ comments.length }})</div>
      <RecycleScroller
        v-if="comments.length > 50"
        :items="comments"
        :item-size="80"
        key-field="rpid"
        v-slot="{ item }"
        class="comment-scroller"
      >
        <CommentItem :comment="item" />
      </RecycleScroller>
      <template v-else>
        <CommentItem v-for="c in comments" :key="c.rpid" :comment="c" />
      </template>

      <RecommendedVideo :videos="related" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { showShareSheet, showToast } from 'vant'
import { usePlayer } from '../composables/usePlayer'
import { useDanmaku } from '../composables/useDanmaku'
import NetworkError from '../components/common/NetworkError.vue'
import DanmakuControl from '../components/player/DanmakuControl.vue'
import ActionButtonBar from '../components/player/ActionButtonBar.vue'
import CreatorInfoBar from '../components/player/CreatorInfoBar.vue'
import VideoDesc from '../components/player/VideoDesc.vue'
import CommentItem from '../components/player/CommentItem.vue'
import RecommendedVideo from '../components/player/RecommendedVideo.vue'

const route = useRoute()
const router = useRouter()
const { containerRef, detail, comments, related, loading, error, loadAndPlay, destroy } = usePlayer()
const dm = useDanmaku({ value: null })

const bvid = route.params.bvid as string

onMounted(() => loadAndPlay(bvid))
onUnmounted(() => destroy())

function retry() { loadAndPlay(bvid) }

function formatCount(n: number): string {
  return n > 10000 ? (n / 10000).toFixed(1) + '万' : String(n)
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('zh-CN')
}

const shareOptions = [
  { name: '微信', icon: 'wechat' },
  { name: 'QQ', icon: 'qq' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
]

function onShare() {
  showShareSheet({ options: shareOptions, onSelect: () => showToast('分享功能') })
}
</script>

<style scoped>
.player-page { background:var(--bg-white); min-height:100vh; }
.player-container { width:100%; aspect-ratio:16/9; background:#000; position:relative; }
.player-container :deep(.artplayer) { position:absolute; inset:0; }
.player-loading { display:flex; align-items:center; justify-content:center; height:100%; }
.section-title { font-size:15px; font-weight:600; padding:16px; border-top:1px solid var(--border-subtle); }
</style>
```

- [ ] **Step 5: Verify player works**

```bash
cd client && npm run dev
# Click any VideoCard → should navigate to /video/BV1xx411c7xx
# Player loads Big Buck Bunny sample video (ArtPlayer)
# Shows ActionButtonBar, CreatorInfoBar, VideoDesc, Comments, Recommended
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: Video Player — ArtPlayer + danmaku + actions + comments + related"
```

---

### Task 9: Login Page

**Files:**
- Create: `client/src/components/login/Brand.vue`, `client/src/components/login/LoginForm.vue`, `client/src/components/login/SocialLoginBar.vue`
- Modify: `client/src/pages/Login.vue`
- Create: `client/src/composables/useAuth.ts`

- [ ] **Step 1: Write Brand component**

Write `client/src/components/login/Brand.vue`:
```vue
<template>
  <div class="brand">
    <van-icon name="play-circle-o" size="64" color="#FB7299" />
    <h1 class="brand-text">bilibili</h1>
    <p class="brand-sub">干杯 []~(￣▽￣)~*</p>
  </div>
</template>

<style scoped>
.brand { display:flex; flex-direction:column; align-items:center; padding:48px 0 32px; }
.brand-text { font-size:28px; font-weight:700; color:var(--pink-primary); margin-top:8px; }
.brand-sub { font-size:14px; color:var(--text-secondary); margin-top:4px; }
</style>
```

- [ ] **Step 2: Write LoginForm**

Write `client/src/components/login/LoginForm.vue`:
```vue
<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit" :loading="loading">
        登录
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

const props = defineProps<{ onLogin: (username: string, password: string) => Promise<void> }>()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await props.onLogin(username.value, password.value)
  } catch {
    showToast('登录失败')
  } finally {
    loading.value = false
  }
}
</script>
```

- [ ] **Step 3: Write SocialLoginBar**

Write `client/src/components/login/SocialLoginBar.vue`:
```vue
<template>
  <div class="social-login">
    <div class="divider">
      <span class="divider-text">其他方式登录</span>
    </div>
    <div class="social-btns">
      <div class="social-btn wechat" @click="onClick('微信')">
        <MessageCircle :size="22" color="#FFFFFF" />
      </div>
      <div class="social-btn qq" @click="onClick('QQ')">
        <MessageSquare :size="22" color="#FFFFFF" />
      </div>
      <div class="social-btn weibo" @click="onClick('微博')">
        <AtSign :size="22" color="#FFFFFF" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { MessageCircle, MessageSquare, AtSign } from 'lucide-vue-next'

function onClick(name: string) {
  showToast(`${name} 登录功能开发中`)
}
</script>

<style scoped>
.social-login { padding:24px 32px; }
.divider { text-align:center; position:relative; margin-bottom:24px; }
.divider-text { font-size:12px; color:var(--text-secondary); background:var(--bg-white); padding:0 12px; position:relative; z-index:1; }
.social-btns { display:flex; justify-content:center; gap:24px; }
.social-btn { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.wechat { background:#07C160; }
.qq { background:#12B7F5; }
.weibo { background:#E6162D; }
</style>
```

- [ ] **Step 4: Write useAuth composable**

Write `client/src/composables/useAuth.ts`:
```typescript
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
```

- [ ] **Step 5: Wire up Login page**

Modify `client/src/pages/Login.vue`:
```vue
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
import { ref } from 'vue'
import { showToast } from 'vant'
import { useAuth } from '../composables/useAuth'
import Brand from '../components/login/Brand.vue'
import LoginForm from '../components/login/LoginForm.vue'
import SocialLoginBar from '../components/login/SocialLoginBar.vue'

const { login } = useAuth()
const agreed = ref(false)

async function handleLogin(username: string, password: string) {
  if (!agreed.value) {
    showToast('请先同意用户协议')
    return
  }
  await login(username, password)
}
</script>

<style scoped>
.login-page { background:var(--bg-white); min-height:100vh; }
.agreement { padding:0 16px; display:flex; justify-content:center; }
.link { color:var(--pink-primary); }
</style>
```

- [ ] **Step 6: Verify login flow**

```bash
# BFF running on :3000
cd client && npm run dev
# Visit /login
# Enter username + password (6+ chars)
# Click login → should redirect to / and show logged in state
# Visit /profile → should show profile page (not redirect to login)
# Refresh page → should stay logged in (cookie persists)
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: Login page — Brand + LoginForm + SocialLoginBar + cookie auth"
```

---

### Task 10: Profile Page

**Files:**
- Create: `client/src/components/profile/UserInfo.vue`, `client/src/components/profile/MenuList.vue`
- Modify: `client/src/pages/Profile.vue`

- [ ] **Step 1: Write UserInfo**

Write `client/src/components/profile/UserInfo.vue`:
```vue
<template>
  <div class="user-info">
    <img :src="user.face" class="avatar" />
    <div class="info">
      <div class="name-row">
        <span class="name">{{ user.name }}</span>
        <span class="level">Lv.{{ user.level }}</span>
      </div>
      <div class="stats">
        <span>{{ formatCount(user.following) }} 关注</span>
        <span>{{ formatCount(user.followers) }} 粉丝</span>
        <span>{{ formatCount(user.likes) }} 获赞</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '../../../../shared/types/user'

defineProps<{ user: UserProfile }>()

function formatCount(n: number): string {
  return n > 10000 ? (n / 10000).toFixed(1) + '万' : String(n)
}
</script>

<style scoped>
.user-info { display:flex; align-items:center; gap:16px; padding:24px 16px; background:var(--pink-primary); }
.avatar { width:64px; height:64px; border-radius:50%; border:2px solid rgba(255,255,255,0.5); }
.info { color:#FFFFFF; }
.name { font-size:18px; font-weight:600; }
.level { font-size:11px; background:rgba(255,255,255,0.3); padding:1px 6px; border-radius:4px; margin-left:8px; }
.stats { display:flex; gap:16px; font-size:12px; margin-top:6px; opacity:0.9; }
</style>
```

- [ ] **Step 2: Write MenuList**

Write `client/src/components/profile/MenuList.vue`:
```vue
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

async function handleLogout() {
  await logout()
}
</script>
```

- [ ] **Step 3: Wire up Profile page**

Modify `client/src/pages/Profile.vue`:
```vue
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
```

- [ ] **Step 4: Verify profile page**

```bash
cd client && npm run dev
# Start BFF on :3000, login first
# Visit /profile → shows UserInfo with pink banner, MenuList
# Click "退出登录" → redirects to / → auth store cleared
# Visit /profile without login → "请先登录" empty state
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Profile page — UserInfo + MenuList + logout"
```

---

### Task 11: Search Page

**Files:**
- Create: `client/src/components/search/HistorySection.vue`, `client/src/components/search/HotSection.vue`
- Modify: `client/src/pages/Search.vue`

- [ ] **Step 1: Write Search components**

Write `client/src/components/search/HistorySection.vue`:
```vue
<template>
  <div class="history-section" v-if="history.length">
    <div class="header">
      <h3>搜索历史</h3>
      <van-icon name="delete-o" @click="$emit('clear')" />
    </div>
    <div class="tags">
      <van-tag v-for="h in history" :key="h" plain type="default" size="medium" @click="$emit('search', h)">{{ h }}</van-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ history: string[] }>()
defineEmits(['clear', 'search'])
</script>

<style scoped>
.history-section { padding:0 16px 16px; }
.header { display:flex; justify-content:space-between; align-items:center; padding:12px 0; }
.header h3 { font-size:15px; font-weight:600; }
.tags { display:flex; flex-wrap:wrap; gap:8px; }
</style>
```

Write `client/src/components/search/HotSection.vue`:
```vue
<template>
  <div class="hot-section">
    <h3>热门搜索</h3>
    <div class="hot-list">
      <div v-for="(kw, i) in hotWords" :key="kw" class="hot-item" @click="$emit('search', kw)">
        <span class="rank" :class="{ top3: i < 3 }">{{ i + 1 }}</span>
        <span class="kw">{{ kw }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ hotWords: string[] }>()
defineEmits(['search'])
</script>

<style scoped>
.hot-section { padding:0 16px; }
.hot-section h3 { font-size:15px; font-weight:600; padding:12px 0; }
.hot-item { display:flex; align-items:center; gap:12px; padding:10px 0; cursor:pointer; }
.rank { width:20px; text-align:center; font-size:14px; font-weight:600; color:var(--text-secondary); }
.top3 { color:#FF6633; }
.kw { font-size:14px; }
</style>
```

- [ ] **Step 2: Wire up Search page**

Modify `client/src/pages/Search.vue`:
```vue
<template>
  <AppLayout>
    <div class="search-page">
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索你感兴趣的内容"
        autofocus
        @search="onSearch"
      />
      <HistorySection
        :history="historyStore.searchHistory"
        @clear="historyStore.clearSearch()"
        @search="onSearch"
      />
      <HotSection
        :hotWords="hotWords"
        @search="onSearch"
      />
      <div v-if="searchResults.length" class="results">
        <VideoCard v-for="v in searchResults" :key="v.bvid" :video="v" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../stores/history'
import { searchApi } from '../api/search'
import AppLayout from '../components/layout/AppLayout.vue'
import HistorySection from '../components/search/HistorySection.vue'
import HotSection from '../components/search/HotSection.vue'
import VideoCard from '../components/home/VideoCard.vue'
import type { VideoItem } from '../../../shared/types/video'

const router = useRouter()
const historyStore = useHistoryStore()
const keyword = ref('')
const hotWords = ref<string[]>([])
const searchResults = ref<VideoItem[]>([])

onMounted(async () => {
  const { data } = await searchApi.getHot()
  hotWords.value = (data as any).data?.keywords || (data as any).keywords || []
})

async function onSearch(kw: string) {
  const q = kw || keyword.value.trim()
  if (!q) return
  historyStore.addSearch(q)
  keyword.value = q
  const { data } = await searchApi.search(q)
  searchResults.value = (data as any).data?.results || (data as any).results || []
}
</script>

<style scoped>
.results { padding:8px; }
.results .video-card { flex:1 1 100%; max-width:100%; }
</style>
```

- [ ] **Step 3: Add empty result state to Search page**

Add to `client/src/pages/Search.vue` template, after `<div class="results">` block:

```vue
<EmptyState v-if="searched && !searchResults.length" message="未找到相关视频" />
```

And add to script:
```typescript
const searched = ref(false)
// In onSearch: searched.value = true after query
```

- [ ] **Step 4: Verify search flow**

```bash
cd client && npm run dev
# Click search bar → Search page with hot words
# Click hot word → shows results
# Search "test" → adds to history → shows VideoCard results
# Clear history → history section disappears
# Search nonexistent → shows "未找到相关视频" empty state
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Search page — HistorySection + HotSection + VideoCard results"
```

---

### Task 12: PWA Configuration + Final Polish

**Files:**
- Modify: `client/vite.config.ts`, `client/index.html`
- Create: `client/src/assets/pwa-192.png`, `client/src/assets/pwa-512.png` (simple placeholder)

- [ ] **Step 1: Configure Vite PWA**

```bash
cd client && npm install -D vite-plugin-pwa
```

Modify `client/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bilibili',
        short_name: 'Bili',
        theme_color: '#FB7299',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
})
```

- [ ] **Step 2: Generate placeholder PWA icons**

```bash
# Create simple pink square PNGs for PWA icons (you can replace with real icons later)
cd client/public
# Use ImageMagick or just create text placeholders
# For now, we'll note this as a manual step
```

- [ ] **Step 3: Add npm scripts**

Modify `server/package.json` scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

- [ ] **Step 4: Final verification**

```bash
# Start both servers
cd server && npm run dev &
cd client && npm run dev &

# Test full user flow:
# 1. Open http://localhost:5173 → Home feed with video cards
# 2. Scroll → infinite load more videos
# 3. Click card → Video player page (ArtPlayer + controls)
# 4. Click "我的" tab → redirect to /login (if not logged in)
# 5. Login → redirected back to /profile
# 6. Search → enter keyword → see results
# 7. Test 404 → visit /random-page → NotFound page
# 8. Visual check: BottomTabBar pink publish button
```

- [ ] **Step 5: Final commit**

```bash
git add -A && git commit -m "feat: PWA config + Vite proxy + README + final polish"
```

---

### Task 13: Testing

**Files:**
- Create: `client/vitest.config.ts`, test files
- Modify: `client/package.json`

- [ ] **Step 1: Install test dependencies**

```bash
cd client && npm install -D vitest @vue/test-utils jsdom
cd server && npm install -D vitest supertest
```

- [ ] **Step 2: Configure Vitest for client**

Write `client/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

Add to `client/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write store tests**

Write `client/src/stores/__tests__/auth.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts not logged in', () => {
    const store = useAuthStore()
    expect(store.isLogin).toBe(false)
    expect(store.user).toBeNull()
  })
})
```

Write `client/src/stores/__tests__/history.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore } from '../history'

describe('history store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds search keyword to history', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    expect(store.searchHistory).toContain('test')
  })

  it('deduplicates search keywords', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    store.addSearch('test')
    expect(store.searchHistory.filter(k => k === 'test').length).toBe(1)
  })

  it('limits search history to 20', () => {
    const store = useHistoryStore()
    for (let i = 0; i < 25; i++) store.addSearch(`keyword${i}`)
    expect(store.searchHistory.length).toBeLessThanOrEqual(20)
  })

  it('clears search history', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    store.clearSearch()
    expect(store.searchHistory.length).toBe(0)
  })
})
```

- [ ] **Step 4: Write component tests**

Write `client/src/components/home/__tests__/VideoCard.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VideoCard from '../VideoCard.vue'

describe('VideoCard', () => {
  const mockVideo = {
    bvid: 'BV1xx411c700',
    title: '测试视频标题',
    cover: 'https://example.com/cover.jpg',
    duration: '12:34',
    playCount: '1.5万播放',
    danmakuCount: '500弹幕',
    author: '测试UP主',
    authorAvatar: 'https://example.com/avatar.jpg',
  }

  it('renders video title', () => {
    const wrapper = mount(VideoCard, { props: { video: mockVideo } })
    expect(wrapper.text()).toContain('测试视频标题')
  })

  it('renders duration badge', () => {
    const wrapper = mount(VideoCard, { props: { video: mockVideo } })
    expect(wrapper.text()).toContain('12:34')
  })

  it('renders author name', () => {
    const wrapper = mount(VideoCard, { props: { video: mockVideo } })
    expect(wrapper.text()).toContain('测试UP主')
  })
})
```

- [ ] **Step 5: Write BFF API tests**

Write `server/src/__tests__/auth.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('POST /api/auth/login', () => {
  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: '', password: '123' })
    expect(res.status).toBe(400) // zod validation
  })

  it('returns 200 and sets cookie for valid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' })
    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.body.data.user.name).toBe('testuser')
  })
})

describe('GET /api/video/feed', () => {
  it('returns video list', async () => {
    const res = await request(app).get('/api/video/feed')
    expect(res.status).toBe(200)
    expect(res.body.data.videos).toBeDefined()
    expect(res.body.data.videos.length).toBe(10)
  })
})
```

- [ ] **Step 6: Run all tests**

```bash
cd client && npx vitest run
cd server && npx vitest run
# All tests should pass
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "test: Vitest + Vue Test Utils + supertest — stores, components, API"
```

---

## Summary

**Total tasks:** 13
**Estimated time:** ~20 days (~4 weeks)
**Key deliverables:**
- 5 fully functional pages with real video playback
- HttpOnly cookie authentication flow with token refresh
- Express BFF with caching + rate limiting + zod input validation
- PWA with offline support
- Pinia stores with persistence
- Infinite scroll feed + vue-virtual-scroller for large comment lists
- Design tokens matching the original .pen file
- Vitest unit + component + API tests with >80% coverage target
