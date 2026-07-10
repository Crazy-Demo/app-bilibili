<template>
  <AppLayout>
    <div class="up-profile" v-if="profile">
      <div class="header-bg">
        <van-nav-bar title="UP主主页" left-arrow @click-left="$router.back()" />
        <div class="up-info">
          <img :src="profile.face" class="avatar" />
          <div class="info-text">
            <div class="name-row">
              <span class="name">{{ profile.name }}</span>
              <span class="level">Lv.{{ profile.level }}</span>
            </div>
            <div class="stats">
              <span>{{ formatCount(profile.following) }} 关注</span>
              <span class="sep">|</span>
              <span>{{ formatCount(profile.followers) }} 粉丝</span>
              <span class="sep">|</span>
              <span>{{ formatCount(profile.likes) }} 获赞</span>
            </div>
          </div>
          <van-button type="primary" size="small" round :loading="followLoading" @click="handleFollow">
            {{ followed ? '已关注' : '+ 关注' }}
          </van-button>
        </div>
      </div>

      <van-tabs v-model:active="activeTab" color="#FB7299">
        <van-tab title="作品">
          <VideoGrid :videos="videos" />
          <EmptyState v-if="!videos.length" message="暂无作品" />
        </van-tab>
        <van-tab title="收藏">
          <EmptyState message="收藏列表暂未开放" />
        </van-tab>
      </van-tabs>
    </div>
    <van-loading v-else class="loading" size="48" color="#FB7299" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import VideoGrid from '../components/home/VideoGrid.vue'
import EmptyState from '../components/common/EmptyState.vue'
import type { UserProfile } from '../../../shared/types/user'
import type { VideoItem } from '../../../shared/types/video'
import { userApi } from '../api/user'
import { feedApi } from '../api/feed'

const route = useRoute()
const uid = computed(() => Number(route.params.uid))
const profile = ref<UserProfile | null>(null)
const videos = ref<VideoItem[]>([])
const activeTab = ref(0)
const followLoading = ref(false)
const followed = ref(false)

onMounted(async () => {
  const { data } = await userApi.getProfile(uid.value)
  profile.value = (data as any).data || (data as any)
  // Load mock videos for this UP
  const feed = await feedApi.getFeed(1, 6)
  videos.value = ((feed.data as any).data?.videos || (feed.data as any).videos || [])
})

function formatCount(n: number): string {
  return n > 10000 ? (n / 10000).toFixed(1) + '万' : String(n)
}

async function handleFollow() {
  followLoading.value = true
  try { await userApi.follow(uid.value); followed.value = !followed.value }
  finally { followLoading.value = false }
}
</script>

<style scoped>
.header-bg {
  background: linear-gradient(135deg, #FB7299, #FC8B5F);
  padding-bottom: 12px;
}
.up-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px 12px;
  color: #fff;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  flex-shrink: 0;
}
.info-text {
  flex: 1;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.name {
  font-size: 18px;
  font-weight: 600;
}
.level {
  font-size: 11px;
  background: rgba(255,255,255,0.3);
  padding: 1px 6px;
  border-radius: 4px;
}
.stats {
  display: flex;
  gap: 4px;
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.9;
}
.sep {
  opacity: 0.5;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
:deep(.van-nav-bar) {
  background: transparent !important;
}
:deep(.van-nav-bar__title) {
  color: #fff;
}
:deep(.van-nav-bar .van-icon) {
  color: #fff;
}
</style>
