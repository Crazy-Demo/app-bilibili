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
.video-grid { display:flex; flex-wrap:wrap; gap:8px; padding:8px 12px; }
</style>
