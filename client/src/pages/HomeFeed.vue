<template>
  <AppLayout>
    <TopSearchBar />
    <CategoryPill />
    <VideoGrid :videos="videos" />
    <EmptyState v-if="!loading && !videos.length && !error" message="暂无推荐视频" />
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
import EmptyState from '../components/common/EmptyState.vue'
import NetworkError from '../components/common/NetworkError.vue'

const { videos, loading, finished, error, loadMore } = useInfiniteScroll()

onMounted(() => loadMore())

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) loadMore()
})
</script>

<style scoped>
.load-more { display:flex; justify-content:center; padding:16px; }
.finished { color:var(--text-secondary); font-size:12px; }
</style>
