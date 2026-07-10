# Bilibili App — 仿 B 站移动端全栈应用

> 个人项目 · 简历展示 · 前端工程能力演示

一个功能完整的仿 B 站（Bilibili）移动端应用，覆盖从首页推荐、视频播放、弹幕互动、搜索、登录注册到个人中心的完整用户链路。项目采用 Vue 3 全栈架构，前端 PWA + Android APK 双形态交付，后端 Node.js BFF 层代理 B 站 API，同时实现安全认证、性能优化、自动化测试等工程化实践。

## ✨ 核心亮点

| 维度 | 实现 |
|------|------|
| **全栈能力** | Vue 3 前端 + Express BFF 后端 + PostgreSQL（规划中），自建认证体系 |
| **移动端优先** | Vant 4 UI 组件库，375px 基准自适应，触摸手势交互 |
| **安全认证** | HttpOnly Cookie JWT + 短期内存 token，XSS/CSRF 双重防护 |
| **性能优化** | 路由懒加载、虚拟列表、Service Worker 离线缓存、请求去重 |
| **工程化** | TypeScript 全量类型覆盖、Vitest 单元/组件/API 测试、ESLint |
| **多平台** | PWA（可安装到手机桌面）+ Capacitor Android APK 原生打包 |
| **真实还原** | 基于 B 站设计稿还原 21 个页面，含 Design System + 设计 Token |

## 🛠 技术栈

### 前端
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建**: Vite 8
- **UI 组件**: Vant 4（B 站粉主题定制）
- **播放器**: ArtPlayer（原生弹幕支持）
- **状态管理**: Pinia + persistedstate 持久化插件
- **路由**: Vue Router 4（懒加载 + 代码分割）
- **工具库**: VueUse、Lucide Icons、dayjs
- **虚拟列表**: vue-virtual-scroller
- **HTTP**: Axios（拦截器注入认证、401 自动刷新、请求缓存）

### 后端 (BFF)
- **运行时**: Node.js + Express 5
- **校验**: Zod（前后端共享 schema）
- **认证**: jsonwebtoken + cookie-parser（HttpOnly JWT）
- **安全**: express-rate-limit 限流、CORS
- **缓存**: lru-cache 内存缓存
- **日志**: morgan

### 测试
- **框架**: Vitest + Vue Test Utils + supertest
- **覆盖**: Store 单元测试、组件测试、API 集成测试

### 平台
- **PWA**: vite-plugin-pwa（Service Worker + 离线缓存策略）
- **移动端**: Capacitor 8 → Android APK

## 📱 已实现页面（18 个）

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页推荐 | `/` | 顶部搜索栏 + 分类胶囊 + 视频卡片无限滚动 |
| 视频播放 | `/video/:id` | ArtPlayer 播放器 + 弹幕控制 + 点赞投币收藏 |
| 全屏播放 | `/full-player/:id` | 横屏沉浸式播放体验 |
| 视频简介 | `/video/:id/desc` | 视频详情 + 标签 + 创作信息 |
| 搜索 | `/search` | 搜索历史 + 热搜榜 + 搜索结果 |
| 登录 | `/login` | 手机号/邮箱 + 密码登录 + 社交登录入口 |
| 个人中心 | `/profile` | 用户信息 + 菜单列表 + 退出登录 |
| 设置 | `/settings` | 弹幕设置 + 播放设置 + 通用设置 |
| 频道 | `/channel` | 分类网格 + 推荐频道（关注按钮） |
| 直播 | `/live/:id` | 直播播放器 + 实时聊天 + 输入栏 |
| 会员购 | `/mall` | Banner 轮播 + 分类行 + 商品网格 |
| 大会员 | `/vip` | 英雄 Banner + 权益网格 + 定价卡片 |
| 评论详情 | `/comment/:id` | 嵌套回复 + 回复输入框 |
| UP 主主页 | `/up/:id` | UP 主信息 + 视频列表 |
| 动态 | `/dynamic` | 关注 UP 主动态流 |
| 通知 | `/notification` | 消息通知列表 |
| 投稿 | `/upload` | 视频上传页面 |
| 404 | `*` | 未匹配路由兜底 |

## 🏗 项目架构

```
bilibili-app/
├── client/                     # Vue 3 前端
│   ├── src/
│   │   ├── api/                # Axios 封装 + 全部 API 模块
│   │   ├── assets/             # 静态资源 + 设计 Token
│   │   ├── components/         # 组件（按业务模块拆分）
│   │   │   ├── common/         #   通用组件（骨架屏/空状态/错误边界）
│   │   │   ├── home/           #   首页组件
│   │   │   ├── player/         #   播放器组件
│   │   │   ├── layout/         #   布局组件（AppLayout + TabBar）
│   │   │   ├── login/          #   登录组件
│   │   │   ├── profile/        #   个人中心组件
│   │   │   └── search/         #   搜索组件
│   │   ├── composables/        # 组合函数（业务逻辑复用）
│   │   ├── pages/              # 路由页面（懒加载）
│   │   ├── router/             # Vue Router 配置
│   │   ├── stores/             # Pinia Store（auth/player/history）
│   │   └── styles/             # 全局样式 + Vant 主题变量
│   ├── android/                # Capacitor Android 工程
│   ├── capacitor.config.ts     # Capacitor 配置
│   └── vite.config.ts          # Vite + PWA 配置
├── server/                     # Express BFF 后端
│   └── src/
│       ├── routes/             # 路由（auth/video/user/search）
│       ├── middleware/         # 中间件（auth/cache/logger/rateLimit/validate）
│       ├── schemas/            # Zod 校验 schema
│       └── services/           # 业务逻辑（B 站 API 代理）
├── shared/                     # 前后端共享
│   └── types/                  # TypeScript 类型定义（api/user/video）
└── docs/                       # 设计文档 + 实施计划
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 1. 安装依赖
cd client && npm install
cd ../server && npm install

# 2. 启动后端（端口 3000）
cd server
npm run dev

# 3. 启动前端（端口 5173）
cd client
npm run dev

# 4. 浏览器访问 http://localhost:5173
```

### 运行测试

```bash
# 前端测试
cd client && npm test

# 后端测试
cd server && npm test
```

### 构建生产版本

```bash
# 前端构建 + PWA 生成
cd client && npm run build

# Android APK 打包
cd client && npx cap sync && npx cap open android
```

## 🔐 安全设计

- **认证方案**: HttpOnly Cookie 存储 JWT（防 XSS）+ 内存 access token（短期，通过 BFF 注入请求头访问 B 站 API）
- **401 处理**: Axios 响应拦截器自动尝试 refresh，失败跳转登录页
- **BFF 隔离**: 前端不直接访问 B 站 API，所有请求经 Express BFF 层代理
- **限流保护**: express-rate-limit 对 `/api` 路由限流
- **输入校验**: Zod schema 前后端共享，BFF 二次校验防止恶意输入
- **HTTPS Only**: 生产环境 Cookie 强制 Secure + SameSite

## ⚡ 性能优化

- **路由懒加载**: 所有页面组件 `() => import(...)` 按需加载
- **虚拟列表**: 评论列表和视频列表使用 `vue-virtual-scroller` 优化 DOM
- **PWA 离线**: Service Worker 缓存静态资源 + NetworkFirst API 策略
- **图片懒加载**: 原生 `loading="lazy"` 属性
- **请求去重**: 并发请求自动去重，减少冗余网络调用
- **骨架屏**: Vant Skeleton 组件，减少布局偏移（CLS）

## 📄 License

MIT

---

*本应用仅用于学习和个人作品展示，所有 UI 和设计参考 B 站客户端，版权归 B 站所有。*
