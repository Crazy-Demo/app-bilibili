<template>
  <AppLayout>
    <div class="dynamic-page">
      <van-nav-bar title="动态" fixed placeholder />
      <van-tabs v-model:active="activeTab" sticky offset-top="46" color="#FB7299" @change="onTabChange">
        <van-tab title="视频" />
        <van-tab title="图文" />
        <van-tab title="全部" />
      </van-tabs>

      <div class="feed-list">
        <div v-for="item in displayItems" :key="item.id" class="dynamic-card" @click="onItemClick(item)">
          <div class="card-header">
            <img :src="item.avatar" class="avatar" />
            <div class="user-info">
              <span class="user-name">{{ item.author }}</span>
              <span class="post-time">{{ item.time }}</span>
            </div>
            <van-button size="mini" round type="primary" plain @click.stop>+ 关注</van-button>
          </div>
          <div class="card-content">{{ item.content }}</div>
          <div v-if="item.images && item.images.length" class="card-images">
            <img v-for="(img, idx) in item.images" :key="idx" :src="img" loading="lazy" />
          </div>
          <div v-if="item.video" class="card-video" @click.stop="$router.push('/video/' + item.video.bvid)">
            <img :src="item.video.cover" class="video-cover" />
            <span class="duration">{{ item.video.duration }}</span>
            <van-icon name="play-circle-o" size="36" color="#fff" class="play-icon" />
          </div>
          <div class="card-actions">
            <span><van-icon name="good-job-o" /> {{ item.likes }}</span>
            <span><van-icon name="chat-o" /> {{ item.comments }}</span>
            <span><van-icon name="share-o" /> 分享</span>
          </div>
        </div>
        <div class="load-more">
          <van-loading v-if="loading" size="24" />
          <span v-else-if="finished" class="finished">— 没有更多了 —</span>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import AppLayout from '../components/layout/AppLayout.vue'

interface VideoInfo {
  bvid: string
  cover: string
  duration: string
}

interface DynamicItem {
  id: number
  type: 'video' | 'image' | 'text'
  author: string
  avatar: string
  time: string
  content: string
  images?: string[]
  video?: VideoInfo
  likes: number
  comments: number
}

const activeTab = ref(0)
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

const mockData: DynamicItem[] = [
  {
    id: 1, type: 'video',
    author: '草莓味的喵', avatar: 'https://picsum.photos/seed/avatar1/100/100',
    time: '3分钟前', content: '今天的直播录像来啦！大家想看的猫咪合集~',
    video: { bvid: 'BV1GJ411x7kY', cover: 'https://picsum.photos/seed/dyn1/400/225', duration: '12:34' },
    likes: 2856, comments: 342,
  },
  {
    id: 2, type: 'video',
    author: '科技未来', avatar: 'https://picsum.photos/seed/avatar2/100/100',
    time: '15分钟前', content: '深度评测新款折叠屏手机，优缺点都在这里了',
    video: { bvid: 'BV1MJ411x7aB', cover: 'https://picsum.photos/seed/dyn2/400/225', duration: '18:20' },
    likes: 1523, comments: 189,
  },
  {
    id: 3, type: 'image',
    author: '摄影日记', avatar: 'https://picsum.photos/seed/avatar3/100/100',
    time: '32分钟前', content: '今天在城市天台拍的日落，太美了🌇',
    images: [
      'https://picsum.photos/seed/dyn3a/400/300',
      'https://picsum.photos/seed/dyn3b/400/300',
      'https://picsum.photos/seed/dyn3c/400/300',
    ],
    likes: 4210, comments: 567,
  },
  {
    id: 4, type: 'video',
    author: '美食猎人', avatar: 'https://picsum.photos/seed/avatar4/100/100',
    time: '1小时前', content: '街边不起眼的小店，没想到味道这么绝！',
    video: { bvid: 'BV1KH411x7kC', cover: 'https://picsum.photos/seed/dyn4/400/225', duration: '08:45' },
    likes: 3892, comments: 421,
  },
  {
    id: 5, type: 'text',
    author: '读书人老张', avatar: 'https://picsum.photos/seed/avatar5/100/100',
    time: '2小时前', content: '刚读完《三体》第三部，整个人都麻了。宇宙规律级别的降维打击，最后归零者重启宇宙...这格局谁能比肩？推荐没看过的朋友一定要读！',
    likes: 1024, comments: 98,
  },
  {
    id: 6, type: 'video',
    author: '运动达人', avatar: 'https://picsum.photos/seed/avatar6/100/100',
    time: '3小时前', content: '30天跑步挑战Day15，今天突破10公里！坚持就是胜利💪',
    video: { bvid: 'BV1LH411x7kD', cover: 'https://picsum.photos/seed/dyn6/400/225', duration: '05:12' },
    likes: 756, comments: 63,
  },
  {
    id: 7, type: 'image',
    author: '旅行收集者', avatar: 'https://picsum.photos/seed/avatar7/100/100',
    time: '4小时前', content: '云南大理的民宿，推开窗就是洱海',
    images: [
      'https://picsum.photos/seed/dyn7a/400/300',
      'https://picsum.photos/seed/dyn7b/400/300',
    ],
    likes: 6321, comments: 892,
  },
  {
    id: 8, type: 'video',
    author: '游戏小能手', avatar: 'https://picsum.photos/seed/avatar8/100/100',
    time: '5小时前', content: '这个Boss我打了50次才过，太解气了！附赠通关攻略',
    video: { bvid: 'BV1NJ411x7kE', cover: 'https://picsum.photos/seed/dyn8/400/225', duration: '22:10' },
    likes: 5432, comments: 678,
  },
  {
    id: 9, type: 'text',
    author: '职场加油站', avatar: 'https://picsum.photos/seed/avatar9/100/100',
    time: '6小时前', content: '分享一个职场小技巧：每天上班前花10分钟列出今天的三个核心目标，完成它们就收工。效率翻倍，还不焦虑。',
    likes: 3341, comments: 256,
  },
  {
    id: 10, type: 'image',
    author: '手作工坊', avatar: 'https://picsum.photos/seed/avatar10/100/100',
    time: '8小时前', content: '花了三天时间做的羊毛毡，还原度怎么样？',
    images: [
      'https://picsum.photos/seed/dyn10a/400/300',
      'https://picsum.photos/seed/dyn10b/400/300',
      'https://picsum.photos/seed/dyn10c/400/300',
      'https://picsum.photos/seed/dyn10d/400/300',
    ],
    likes: 2108, comments: 189,
  },
]

const displayItems = computed(() => {
  const type = activeTab.value === 0 ? 'video' : activeTab.value === 1 ? 'image' : null
  if (type === null) return mockData.slice(0, page.value * 10)
  return mockData.filter((item) => item.type === type).slice(0, page.value * 10)
})

function onTabChange() {
  page.value = 1
  finished.value = true
}

function onItemClick(item: DynamicItem) {
  if (item.type === 'video' && item.video) {
    // handled by card-video click.stop
  } else {
    showToast('查看详情开发中')
  }
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 300)
})

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading.value && !finished.value) {
    loading.value = true
    setTimeout(() => {
      page.value++
      loading.value = false
    }, 400)
  }
})
</script>

<style scoped>
.dynamic-page {
  min-height: 100vh;
  background: #f5f5f5;
}

:deep(.van-nav-bar) {
  z-index: 100;
}

:deep(.van-tabs--sticky) {
  position: sticky;
  top: 46px;
  z-index: 99;
}

.feed-list {
  padding: 8px 0;
}

.dynamic-card {
  background: #fff;
  margin: 8px 12px;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.post-time {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.card-content {
  font-size: 14px;
  line-height: 1.6;
  color: #222;
  margin-bottom: 10px;
  word-break: break-word;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 10px;
}

.card-images img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 4px;
}

.card-video {
  position: relative;
  margin-bottom: 10px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}

.video-cover {
  width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.85;
}

.card-actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  color: #666;
  font-size: 12px;
}

.card-actions span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.finished {
  color: #999;
  font-size: 12px;
}
</style>
