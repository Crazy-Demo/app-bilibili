<template>
  <div class="recommended-section">
    <h3 class="section-title">相关推荐</h3>
    <div class="related-list">
      <div
        class="related-card"
        v-for="video in videos"
        :key="video.bvid"
        @click="goToVideo(video.bvid)"
      >
        <div class="related-cover-wrap">
          <img class="related-cover" :src="video.cover" :alt="video.title" loading="lazy" />
          <span class="related-duration">{{ video.duration }}</span>
        </div>
        <div class="related-info">
          <p class="related-title">{{ video.title }}</p>
          <span class="related-meta">{{ video.author }} · {{ video.playCount }}次播放</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { VideoItem } from '../../../../shared/types/video'

defineProps<{
  videos: VideoItem[]
}>()

const router = useRouter()

function goToVideo(bvid: string) {
  router.push({ name: 'video', params: { bvid } })
}
</script>

<style scoped>
.recommended-section {
  padding: 12px 0 24px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 16px 12px;
  color: var(--text-primary);
}
.related-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.related-card {
  display: flex;
  gap: 10px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.related-cover-wrap {
  position: relative;
  width: 140px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}
.related-cover {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}
.related-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
}
.related-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.related-title {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.related-meta {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
