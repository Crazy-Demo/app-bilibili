<template>
  <div class="video-card" @click="$router.push(`/video/${video.bvid}`)">
    <div class="cover-wrapper">
      <img :src="video.cover" :alt="video.title" loading="lazy" class="cover" />
      <span class="duration">{{ video.duration }}</span>
    </div>
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <span class="author" @click.stop="$router.push('/user/10001')">{{ video.author }}</span>
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
.video-card { flex:1 1 calc(50% - 4px); min-width:0; cursor:pointer; }
.cover-wrapper { position:relative; width:100%; aspect-ratio:16/9; border-radius:var(--radius-md); overflow:hidden; background:var(--bg-gray); }
.cover { width:100%; height:100%; object-fit:cover; }
.duration { position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:1px 4px; border-radius:2px; }
.info { padding:4px 0; }
.title { font-size:13px; font-weight:500; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; font-size:11px; color:var(--text-secondary); }
</style>
