<template>
  <AppLayout>
    <div class="search-page">
      <van-search v-model="keyword" shape="round" placeholder="搜索你感兴趣的内容" autofocus @search="onSearch" />
      <HistorySection :history="historyStore.searchHistory" @clear="historyStore.clearSearch()" @search="onSearch" />
      <HotSection :hotWords="hotWords" @search="onSearch" />
      <div v-if="searched && searchResults.length" class="results">
        <VideoCard v-for="v in searchResults" :key="v.bvid" :video="v" />
      </div>
      <EmptyState v-if="searched && !searchResults.length" message="未找到相关视频" />
    </div>
  </AppLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHistoryStore } from '../stores/history'
import { searchApi } from '../api/search'
import AppLayout from '../components/layout/AppLayout.vue'
import HistorySection from '../components/search/HistorySection.vue'
import HotSection from '../components/search/HotSection.vue'
import VideoCard from '../components/home/VideoCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
import type { VideoItem } from '../../../shared/types/video'

const historyStore = useHistoryStore()
const keyword = ref('')
const hotWords = ref<string[]>([])
const searchResults = ref<VideoItem[]>([])
const searched = ref(false)

onMounted(async () => {
  try {
    const { data } = await searchApi.getHot()
    hotWords.value = (data as any).data?.keywords || (data as any).keywords || []
  } catch {
    // silently fail on hot words fetch
  }
})

async function onSearch(kw: string) {
  const q = kw || keyword.value.trim()
  if (!q) return
  historyStore.addSearch(q)
  keyword.value = q; searched.value = true
  try {
    const { data } = await searchApi.search(q)
    searchResults.value = (data as any).data?.results || (data as any).results || []
  } catch {
    searchResults.value = []
  }
}
</script>
<style scoped>
.results { padding:8px; }
.results .video-card { flex:1 1 100%; max-width:100%; }
</style>
