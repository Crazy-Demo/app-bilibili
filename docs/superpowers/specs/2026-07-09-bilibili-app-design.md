# Bilibili App — 设计文档

> 基于 `/home/xm/penclis/bilibili.pen` 设计稿，Vue 3 全栈实现。
> 设计稿含 21 个顶层 frame（1 个 Design System + 1 个 Component Library + 19 个 App 页面），及完整 Design Tokens。

## 1. 项目目标

功能完整的 B 站 App（PWA），展现前端工程能力，用于简历展示。

- 3 周 MVP，核心 5 页面：Home Feed / Video Player / Login / Profile / Search
- 前端：Vue 3 + Vite + Vant + Pinia + Vue Router
- 后端：Express BFF 层（Node.js）
- 平台：PWA（移动端优先，375 → 自适应）
- 认证：HttpOnly cookie JWT + 短期内存 token（XSS 防护）

## 2. 技术栈

| 层 | 选型 | 理由 |
|----|------|------|
| 框架 | Vue 3 + Vite | 主流、速度快、生态好 |
| UI 组件 | Vant 4 | 移动端组件最全，CSS 变量定制 B 站粉 |
| 播放器 | ArtPlayer | 原生弹幕支持，开箱即用 |
| 状态管理 | Pinia + persist plugin | 官方推荐，自动持久化（仅非敏感数据） |
| 路由 | Vue Router 4 | 标准方案，懒加载自动代码分割 |
| 组合函数 | VueUse | `useInfiniteScroll`/`useStorage`/`useSwipe` |
| 图标 | Lucide Vue | 与设计稿一致 |
| 请求 | Axios | 拦截器注入认证、401 重定向、请求缓存 |
| 输入校验 | zod | 前后端共享 schema，BFF 路由校验 |
| PWA | vite-plugin-pwa | Service Worker + 离线缓存 |
| 后端 | Express + cookie-parser | HttpOnly cookie 认证 |
| B 站数据 | bilibili-API-collect | 社区维护的非官方 API 文档 |
| 测试 | Vitest + Vue Test Utils | 单元 + 组件测试 |
| 图片 | 原生 `loading="lazy"` | 现代浏览器原生支持，无需额外依赖 |
| 虚拟列表 | vue-virtual-scroller | 评论列表、视频列表 DOM 优化 |

## 3. 项目结构

```
bilibili-app/
├── client/                        # Vue 3 前端
│   ├── src/
│   │   ├── pages/                 # 路由页面 (懒加载)
│   │   │   ├── HomeFeed.vue
│   │   │   ├── VideoPlayer.vue
│   │   │   ├── Login.vue
│   │   │   ├── Profile.vue
│   │   │   ├── Search.vue
│   │   │   └── NotFound.vue       # 404 页面
│   │   ├── components/            # 通用组件
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.vue
│   │   │   │   └── BottomTabBar.vue
│   │   │   ├── common/
│   │   │   │   ├── EmptyState.vue       # 空状态占位
│   │   │   │   ├── ErrorBoundary.vue    # onErrorCaptured 错误边界
│   │   │   │   ├── NetworkError.vue     # 网络错误提示
│   │   │   │   └── SkeletonCard.vue     # Vant Skeleton 骨架屏
│   │   │   ├── home/
│   │   │   │   ├── TopSearchBar.vue
│   │   │   │   ├── CategoryPill.vue
│   │   │   │   ├── VideoGrid.vue
│   │   │   │   └── VideoCard.vue
│   │   │   ├── player/
│   │   │   │   ├── ActionButtonBar.vue
│   │   │   │   ├── CreatorInfoBar.vue
│   │   │   │   ├── DanmakuControl.vue
│   │   │   │   ├── VideoDesc.vue
│   │   │   │   ├── CommentItem.vue
│   │   │   │   └── RecommendedVideo.vue
│   │   │   ├── login/
│   │   │   │   ├── Brand.vue
│   │   │   │   ├── LoginForm.vue
│   │   │   │   └── SocialLoginBar.vue
│   │   │   ├── profile/
│   │   │   │   ├── UserInfo.vue
│   │   │   │   └── MenuList.vue
│   │   │   └── search/
│   │   │       ├── HistorySection.vue
│   │   │       └── HotSection.vue
│   │   ├── composables/
│   │   │   ├── useAuth.ts         # 登录态封装
│   │   │   ├── useInfiniteScroll.ts # 视频流加载（VueUse 封装）
│   │   │   ├── usePlayer.ts       # ArtPlayer 实例管理
│   │   │   └── useDanmaku.ts      # 弹幕开关/发送
│   │   ├── stores/
│   │   │   ├── auth.ts            # 用户 + token（仅内存 + cookie）
│   │   │   ├── player.ts          # 当前播放状态
│   │   │   └── history.ts         # 搜索/播放历史（localStorage 持久化）
│   │   ├── api/
│   │   │   ├── client.ts          # Axios 实例（拦截器配置）
│   │   │   ├── feed.ts            # 首页推荐
│   │   │   ├── video.ts           # 视频详情/播放地址
│   │   │   ├── auth.ts            # 登录/登出
│   │   │   ├── user.ts            # 用户/UP主
│   │   │   └── search.ts          # 搜索
│   │   ├── router/
│   │   │   └── index.ts           # 路由配置 + 守卫
│   │   ├── styles/
│   │   │   ├── tokens.css         # Design tokens (CSS 变量)
│   │   │   └── main.css           # 全局样式
│   │   ├── assets/                # 静态资源（含 PWA 图标）
│   │   ├── App.vue
│   │   └── main.ts
│   ├── .env                       # VITE_API_BASE_URL
│   ├── .env.production            # 生产环境变量
│   ├── index.html
│   └── vite.config.ts
│
├── server/                        # Express BFF
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── video.ts
│   │   │   ├── user.ts
│   │   │   └── search.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT 验证（读 cookie）
│   │   │   ├── cache.ts           # LRU 缓存
│   │   │   ├── logger.ts          # 请求日志
│   │   │   ├── rateLimiter.ts     # 限流（express-rate-limit）
│   │   │   └── validate.ts        # zod 校验中间件
│   │   ├── services/
│   │   │   └── bilibili.ts        # B 站 API 封装
│   │   ├── schemas/               # zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── video.ts
│   │   │   └── search.ts
│   │   ├── app.ts                 # Express 入口
│   │   └── index.ts               # 启动
│   ├── .env                       # PORT, JWT_SECRET, BILIBILI_API_BASE
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                        # 前后端共享
│   └── types/
│       ├── video.ts
│       ├── user.ts
│       └── api.ts
│
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-07-09-bilibili-app-design.md
```

## 4. Component Tree

```
App.vue
├── ErrorBoundary.vue               (onErrorCaptured 错误捕获)
│   ├── AppLayout.vue
│   │   ├── <router-view />         (页面内容 + slide 过渡动画)
│   │   └── BottomTabBar.vue        (Vant Tabbar 定制)
│   │
│   ├── pages/
│   │   ├── HomeFeed.vue            / 
│   │   │   ├── TopSearchBar.vue    (Vant NavBar + Search)
│   │   │   ├── CategoryPill.vue    (Vant Sticky + 横向 Tabs)
│   │   │   ├── SkeletonCard.vue × N (加载时骨架屏)
│   │   │   └── VideoGrid.vue
│   │   │       └── VideoCard.vue × N (封面/标题/UP主/播放量, loading="lazy")
│   │   │
│   │   ├── VideoPlayer.vue         /video/:bvid
│   │   │   ├── ArtPlayer           (第三方播放器挂载)
│   │   │   ├── DanmakuControl.vue  (弹幕浮层 → 映射 DanmakuOverlay)
│   │   │   ├── ActionButtonBar.vue (点赞/投币/收藏/分享)
│   │   │   ├── CreatorInfoBar.vue  (UP主头像 + 关注按钮)
│   │   │   ├── VideoDesc.vue       (折叠/展开简介，MVP 中实现)
│   │   │   ├── CommentItem.vue × N (vue-virtual-scroller 优化)
│   │   │   └── RecommendedVideo.vue × N
│   │   │
│   │   ├── Login.vue               /login
│   │   │   ├── Brand.vue            (Logo + "bilibili")
│   │   │   ├── TabSwitcher.vue      (验证码/密码)
│   │   │   ├── LoginForm.vue        (Vant Form + Field + Button)
│   │   │   ├── SocialLoginBar.vue   (微信/QQ/微博图标按钮 → 展示占位)
│   │   │   └── AgreementCheck.vue   (协议勾选)
│   │   │
│   │   ├── Profile.vue             /profile
│   │   │   ├── UserInfo.vue         (头像/昵称/等级)
│   │   │   ├── StatBar.vue          (关注/粉丝/获赞数)
│   │   │   └── MenuList.vue         (Vant Cell 功能入口)
│   │   │
│   │   ├── Search.vue              /search
│   │   │   ├── SearchHeader.vue     (Vant Search 自动聚焦)
│   │   │   ├── HistorySection.vue   (搜索历史 + 清除)
│   │   │   └── HotSection.vue       (热门搜索标签)
│   │   │
│   │   └── NotFound.vue            /* (404 兜底)
│   │
│   └── NetworkError.vue            (全局网络错误 Toast)
```

### 设计稿 Component Library → Vue 实现映射（12 组件全覆盖）

| 设计稿组件 | 实现方式 |
|-----------|---------|
| BottomTabBar | Vant `Tabbar` + CSS 定制粉色凸起中间按钮 |
| TopSearchBar | Vant `NavBar` left slot + `Search` widget |
| CategoryPill | Vant `Sticky` + `Tabs` (scrollspy 模式) |
| VideoCard | 手写 `flex: 1 1 50%`，`<img loading="lazy">` 原生懒加载 |
| VideoPlayer | ArtPlayer `new ArtPlayer({container, url})` |
| DanmakuOverlay | ArtPlayer 内置弹幕 + `DanmakuControl.vue` 手写浮层 |
| ActionButtonBar | 手写 `flex row` 图标 + 数字 |
| CreatorInfoBar | 手写（头像 + 昵称 + 关注按钮 + Vant `Button`） |
| CommentItem | 手写（头像 + 昵称 + 内容 + 回复数） |
| RecommendedVideo | 手写横向滚动卡片列表，可复用 VideoCard 简化版 |
| LoginForm | Vant `Form` + `Field` + `Button` |
| SocialLoginBar | 3 个 Vant `Button` (round, icon only)，MVP 仅展示不发请求 |

### 页面状态覆盖

| 页面 | 加载中 | 空数据 | 网络错误 | 正常 |
|------|--------|--------|---------|------|
| HomeFeed | Vant `Skeleton` 骨架屏 | "暂无推荐视频" 占位图 | `NetworkError` toast + 缓存兜底 | VideoGrid |
| VideoPlayer | 播放器占位黑底 + `Loading` spinner | N/A | "加载失败，请重试" | ArtPlayer |
| Login | 按钮 loading spinner | N/A | "网络错误，请稍后" toast | 表单 |
| Profile | `Skeleton` 头像+文字 | 默认头像 + "未登录" | 本地缓存用户信息兜底 | 用户信息 |
| Search | 输入框 skeleton | "暂无搜索历史" / "暂无热门搜索" | Toast 提示 | 列表 |

## 5. 路由设计

| 路径 | 页面 | 需要登录 | 说明 |
|------|------|---------|------|
| `/` | HomeFeed | 否 | 默认首页 |
| `/video/:bvid` | VideoPlayer | 否 | B 站 BV 号 |
| `/login` | Login | 否 | ?redirect=xxx |
| `/profile` | Profile | 是 | 未登录跳转 /login |
| `/search` | Search | 否 | 搜索页 |
| `/:pathMatch(.*)*` | NotFound | 否 | 404 兜底 |

**路由守卫：**
```typescript
router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
```

**页面切换：** Vue Router `<Transition>` + `slide-left` / `slide-right` CSS 动画。

**代码分割：** 每页 `() => import('./pages/XXX.vue')`，Vite 自动按路由切割 chunk。

**底部 Tab 路由映射：**

| Tab | 图标 (lucide) | 路由 | MVP 行为 |
|-----|-------------|------|---------|
| 首页 | house | `/` | 首页 |
| 动态 | compass | `/search` | **TODO: 实现动态页后改路由** |
| **发布** (粉色凸起) | plus | 弹出 ActionSheet | Vant `ShareSheet`（复用设计稿 ShareSheet 设计） |
| 会员购 | shopping-bag | `/` | **TODO: 实现会员购页后改路由** |
| 我的 | user | `/profile` | 需登录 |

## 6. 环境配置

### client/.env
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### client/.env.production
```bash
VITE_API_BASE_URL=https://api.your-domain.com/api
```

### server/.env
```bash
PORT=3000
JWT_SECRET=<random-64-char-string>
JWT_EXPIRES_IN=7d
BILIBILI_API_BASE=https://api.bilibili.com
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## 7. BFF API 设计

### 端点列表

```
Auth
  POST   /api/auth/login        { username, password }       → Set-Cookie: token (HttpOnly)
  POST   /api/auth/logout                                     → Clear cookie
  GET    /api/auth/me            校验 cookie                 → { user }
  POST   /api/auth/refresh       用 cookie 刷新 token        → Set-Cookie: new_token

User
  GET    /api/user/me            当前登录用户信息 + 统计数据   → { user, stats }
  GET    /api/user/:uid/profile  UP主主页                     → { user, stats }
  POST   /api/user/:uid/follow   关注 (需登录)                → { ok }

Video
  GET    /api/video/feed         ?page=1&pageSize=10          → { videos[], total }
  GET    /api/video/:bvid        视频详情                      → { video, pages[] }
  GET    /api/video/:bvid/playurl 播放地址(BFF 代理)           → { url, quality[] }
  GET    /api/video/:bvid/comments ?page=1&sort=hot           → { comments[], total }
  GET    /api/video/:bvid/related 推荐视频                     → { videos[] }

Search
  GET    /api/search             ?keyword=xxx&page=1           → { results[] }
  GET    /api/search/hot         热门搜索词                     → { keywords[] }
  GET    /api/search/suggest     ?keyword=xxx                  → { suggestions[] }
```

### BFF 中间件

```
cookieParser     → 解析 HttpOnly cookie 中的 JWT
authMiddleware   → 验证 JWT，注入 req.user（白名单路由跳过）
validateBody     → zod schema 校验请求 body
validateParams   → zod schema 校验路径参数
cacheMiddleware  → node-lru-cache 内存缓存，TTL 5min（/feed、/hot）
rateLimiter      → express-rate-limit，60s 内 100 次/IP
logMiddleware    → morgan 请求日志
corsMiddleware   → credentials: true，origin 白名单
```

### 认证流程

```
登录:
  POST /api/auth/login {username, password}
  → BFF 校验 → 签发 JWT (exp=7d)
  → Set-Cookie: token=JWT; HttpOnly; Secure; SameSite=Strict
  → 返回 body: { user } (不含 token)

后续请求:
  browser 自动带 cookie
  → authMiddleware 解析 cookie → req.user
  → 无需前端手动管理 token header

前端获取当前用户:
  GET /api/auth/me (由 cookie 认证)
  → auth store 存 user 到内存

Token 刷新:
  401 响应 → Axios 拦截器自动 POST /api/auth/refresh
  → 失败则 redirect /login

登出:
  POST /api/auth/logout → Clear cookie + 前端清空 auth store
```

> **安全说明：** JWT 存储在 HttpOnly cookie 中，JavaScript 不可读，防止 XSS 窃取。
> 前端 Pinia auth store 仅存 `user` 对象和 `isLogin` 状态，不存 token。
> auth store 使用 `pinia-plugin-persistedstate` 仅持久化非敏感数据（`user` 基本信息）。

### 输入校验（zod schemas）

```typescript
// shared/schemas/ 或 server/src/schemas/
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(100),
})

export const videoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
})

export const bvidSchema = z.object({
  bvid: z.string().regex(/^BV[a-zA-Z0-9]{10}$/),
})

export const searchQuerySchema = z.object({
  keyword: z.string().min(1).max(100),
  page: z.coerce.number().int().min(1).default(1),
})
```

### 架构图

```
┌──────────┐   cookie 自动携带    ┌───────────────────────┐      ┌──────────┐
│  client  │ ◀──────────────────▶  │  Express BFF :3000   │────▶│  B站 API  │
│  :5173   │   /api/*              │                       │      │  (外部)    │
│          │                       │  cookieParser         │      │          │
│  Axios   │   HttpOnly cookie     │  authMiddleware       │      │  非官方   │
│          │   401 → refresh       │  zod validateBody     │      │  接口     │
│          │                       │  rateLimiter          │      │          │
│          │                       │  LRU cache            │      │          │
└──────────┘                       └───────────────────────┘      └──────────┘
```

## 8. 数据流

### Pinia Stores

```
auth store (仅内存，cookie 存 token)
  state:  user, isLogin
  actions: login(), logout(), fetchMe(), refreshToken()
  persist: 仅 user 基本字段 → localStorage（供离线展示）

player store
  state:  bvid, cid, isPlaying, danmakuEnabled, currentTime
  actions: play(bvid), pause(), toggleDanmaku()

history store
  state:  searchHistory[], playbackHistory[]
  actions: addSearch(kw), clearSearch(), addPlayback(video)
  persist: localStorage（非敏感）
```

### 典型数据流

```
HomeFeed 加载:
  HomeFeed.vue mounted()
  → 显示 SkeletonCard[] 骨架屏
  → feedApi.getFeed(page=1)
  → Axios GET /api/video/feed (cookie 自动携带)
  → Express → cacheMiddleware (命中 → 直接返回)
  → Express → bilibili service → 返回视频列表
  → VideoGrid 渲染 VideoCard[] (原生 loading="lazy")
  → 用户滚动到底部
  → useInfiniteScroll 触发 → feedApi.getFeed(page++)
  → 追加到列表 (超过 50 条启用 vue-virtual-scroller)

播放视频:
  点击 VideoCard
  → router.push('/video/BVxxxx')
  → VideoPlayer.vue mounted()
  → videoApi.getPlayurl(bvid)
  → 播放器占位黑底 + Loading spinner
  → ArtPlayer({ container, url }) 挂载成功
  → 并行请求: getDetail / getComments / getRelated
  → 渲染 UP 主信息 + 简介 + 评论 + 推荐

登录:
  填写表单 → authApi.login({user, pass})
  → BFF 校验 → 签发 JWT → Set-Cookie HttpOnly
  → 返回 { user } → auth store 记录 user + isLogin=true
  → redirect query 参数跳回来源页

Token 过期:
  任何 API 返回 401
  → Axios 拦截器 → authApi.refresh()
  → 成功 → 重放原请求
  → 失败 → auth.logout() → router.push('/login')

离线兜底:
  vite-plugin-pwa generateSW 预缓存 index.html + 关键资源
  feed 接口失败 → 显示缓存数据 (Axios cache adapter) + NetworkError toast
  server 500 → ErrorBoundary 捕获 → 显示 NetworkError 组件
```

## 9. Design Tokens (来自 bilibili.pen)

### 颜色

```css
:root {
  --pink-primary:   #FB7299;
  --pink-hover:     #FC8DB3;
  --pink-pressed:   #E55F85;
  --pink-disabled:  #FB729966;
  --blue-primary:   #00A1D6;
  --bg-white:       #FFFFFF;
  --bg-gray:        #F5F5F5;
  --text-primary:   #1A1A1A;
  --text-secondary: #9CA3AF;
  --border-subtle:  #E5E7EB;
  --success:        #52C41A;
  --warning:        #FAAD14;
  --error:          #FF4D4F;
  --hot-orange:     #FF9933;
  --hot-red:        #FF6633;
  --hot-yellow:     #FFCC33;
}
```

### 间距

```
xs:4  sm:8  md:12  lg:16  xl:24  2xl:32
```

### 字体

```
Title:     24px Bold
Subtitle:  18px Semibold
Button:    16px Semibold
Body:      14px Medium
Caption:   12px Regular
Small:     11px Regular
Tab:       10px Semibold
```

### 圆角

```
sm:4  md:8  lg:12  full:9999
```

## 10. Vant 定制

Vant 4 支持 CSS 变量覆盖，关键定制：

```css
:root {
  --van-primary-color: #FB7299;
  --van-tabbar-item-active-color: #FB7299;
  --van-nav-bar-icon-color: #1A1A1A;
  --van-search-left-icon-color: #9CA3AF;
  --van-button-primary-background: #FB7299;
  --van-tabs-bottom-bar-color: #FB7299;
}
```

## 11. PWA 配置

```typescript
// vite.config.ts - VitePWA plugin
{
  registerType: 'autoUpdate',
  manifest: {
    name: 'Bilibili',
    short_name: 'Bili',
    theme_color: '#FB7299',
    background_color: '#FFFFFF',
    display: 'standalone',
    orientation: 'portrait',
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
        options: { cacheName: 'api-cache', expiration: { maxEntries: 100, maxAgeSeconds: 300 } },
      },
    ],
  },
}
```

## 12. 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| 单元测试 | Vitest | composables、stores、工具函数 |
| 组件测试 | Vitest + Vue Test Utils | 关键组件（VideoCard、LoginForm、CommentItem）|
| API 测试 | Vitest + supertest | BFF 路由 + 中间件 |
| E2E | 可选，MVP 后补充 | Playwright 关键路径 |

```
测试目标：
  - composables 覆盖率 > 80%
  - API 路由覆盖率 > 90%
  - 关键 UI 组件冒烟测试 (render + 用户交互)
```

## 13. 实施顺序（修订后）

| 阶段 | 内容 | 预计时间 |
|------|------|---------|
| 1 | 项目脚手架 (monorepo + Vite + Express + 共享类型 + env) | 1 天 |
| 2 | Design Tokens + Vant 定制主题 + Vant 全局注册 | 0.5 天 |
| 3 | 通用布局 + BottomTabBar + 路由 + 404/Empty/Error 组件 | 1.5 天 |
| 4 | BFF 基础框架 (cookie auth + 中间件 + zod schemas + rateLimit) | 1.5 天 |
| 5 | Home Feed 页面 (VideoCard + useInfiniteScroll + Skeleton) | 2 天 |
| 6 | Video Player 页面 (ArtPlayer + 弹幕 + 互动 + 评论 + 推荐) | 4 天 |
| 7 | Login 页面 (表单 + cookie 认证 + 社交按钮占位) | 1 天 |
| 8 | Profile 页面 (用户信息 + 菜单 + 数据统计) | 1 天 |
| 9 | Search 页面 (搜索 + 历史 + 热门) | 1 天 |
| 10 | PWA 配置 + 离线兜底 + 错误处理完善 | 1.5 天 |
| 11 | 测试 + Bug 修复 | 2 天 |
| 12 | 部署 + README + 简历描述 | 1 天 |

**合计约 18 天 ≈ 3 周**

### 风险缓冲

| 风险 | 缓解措施 |
|------|---------|
| B 站 API 不稳定 | BFF 层隔离，可切 mock 模式 |
| ArtPlayer 兼容问题 | 阶段 6 预留 4 天（原始估计 3 天 + 1 天缓冲）|
| cookie 跨域调试 | 开发环境 vite proxy 固定 localhost，避免跨域 |

## 14. 未纳入 MVP 的页面（后续迭代）

设计稿共 19 个 App 页面，MVP 覆盖 5 个核心页面，以下 14 个页面后续逐步添加：

Channel / Dynamic / Mall / FullPlayer / UPProfile / Notification / Upload / DanmakuSettings / CommentDetail / LiveStream / Settings / VIP / ShareSheet（独立页面版本）/ 完整 Detail 页

> 注：`ShareSheet` 和 `DanmakuControl` 在 MVP 中以浮层/弹窗形式嵌入 VideoPlayer，不作为独立路由页面；
> `VideoDesc` 作为播放页内联组件实现。后续迭代可扩展为独立全屏页。
