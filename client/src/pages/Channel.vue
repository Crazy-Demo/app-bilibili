<template>
  <AppLayout>
    <div class="channel-page">
      <van-nav-bar title="频道" fixed placeholder />

      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="cat-item"
          @click="onCatClick(cat.name)"
        >
          <div class="cat-icon" :style="{ background: cat.color }">
            <component :is="cat.icon" :size="28" color="#FFFFFF" />
          </div>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">推荐频道</h3>
        <div class="channel-list">
          <div
            v-for="ch in channels"
            :key="ch.name"
            class="channel-card"
            @click="$router.push('/user/' + ch.mid)"
          >
            <img :src="ch.avatar" class="ch-avatar" />
            <div class="ch-info">
              <span class="ch-name">{{ ch.name }}</span>
              <span class="ch-desc">{{ ch.subs }}</span>
            </div>
            <van-button
              type="primary"
              size="small"
              round
              @click.stop="followCh(ch)"
            >
              {{ ch.followed ? '已关注' : '+ 关注' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import {
  Gamepad2,
  Music2,
  Palette,
  Cpu,
  Flame,
  Laugh,
  TrendingUp,
  Film,
  Dumbbell,
  Globe,
} from 'lucide-vue-next'
import AppLayout from '../components/layout/AppLayout.vue'

const categories = [
  { name: '游戏', icon: Gamepad2, color: '#FF6B6B' },
  { name: '音乐', icon: Music2, color: '#4ECDC4' },
  { name: '绘画', icon: Palette, color: '#45B7D1' },
  { name: '科技', icon: Cpu, color: '#96CEB4' },
  { name: '生活', icon: Flame, color: '#FFEAA7' },
  { name: '搞笑', icon: Laugh, color: '#DDA0DD' },
  { name: '时尚', icon: TrendingUp, color: '#FF8A5C' },
  { name: '影视', icon: Film, color: '#A29BFE' },
  { name: '运动', icon: Dumbbell, color: '#55E6C1' },
  { name: '知识', icon: Globe, color: '#74B9FF' },
]

interface Channel {
  name: string
  avatar: string
  subs: string
  mid: number
  followed: boolean
}

const channels = ref<Channel[]>([
  {
    name: '番剧时间',
    avatar: 'https://picsum.photos/seed/ch1/48/48',
    subs: '52.3万订阅',
    mid: 10001,
    followed: false,
  },
  {
    name: '极客科技',
    avatar: 'https://picsum.photos/seed/ch2/48/48',
    subs: '18.7万订阅',
    mid: 10002,
    followed: false,
  },
  {
    name: '游戏电玩',
    avatar: 'https://picsum.photos/seed/ch3/48/48',
    subs: '88.1万订阅',
    mid: 10003,
    followed: false,
  },
  {
    name: '音乐现场',
    avatar: 'https://picsum.photos/seed/ch4/48/48',
    subs: '35.6万订阅',
    mid: 10004,
    followed: false,
  },
  {
    name: '动画短片',
    avatar: 'https://picsum.photos/seed/ch5/48/48',
    subs: '12.4万订阅',
    mid: 10005,
    followed: false,
  },
])

function onCatClick(name: string) {
  showToast(`${name} 频道开发中`)
}

function followCh(ch: Channel) {
  ch.followed = !ch.followed
}
</script>

<style scoped>
.channel-page {
  padding-bottom: 24px;
}

/* Category grid: 5 columns */
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 0;
  padding: 16px 12px;
}

.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.cat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-name {
  font-size: 12px;
  color: var(--van-text-color);
}

/* Section */
.section {
  margin-top: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 16px;
  margin: 12px 0;
  color: var(--van-text-color);
}

/* Channel cards */
.channel-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.channel-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--van-background-2, #fff);
  border-radius: 10px;
  cursor: pointer;
}

.ch-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.ch-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ch-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--van-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ch-desc {
  font-size: 12px;
  color: var(--van-text-color-weak, #999);
}
</style>
