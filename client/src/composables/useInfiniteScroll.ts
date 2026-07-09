import { ref } from 'vue'
import type { VideoItem } from '../../../shared/types/video'
import { feedApi } from '../api/feed'

export function useInfiniteScroll() {
  const videos = ref<VideoItem[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const error = ref<string | null>(null)

  async function loadMore() {
    if (loading.value || finished.value) return
    loading.value = true; error.value = null
    try {
      const page = Math.floor(videos.value.length / 10) + 1
      const { data } = await feedApi.getFeed(page, 10)
      const newVideos = (data as any).data?.videos || (data as any).videos || []
      videos.value.push(...newVideos)
      if (newVideos.length < 10) finished.value = true
    } catch (err) {
      error.value = '加载失败，请重试'
    } finally { loading.value = false }
  }

  return { videos, loading, finished, error, loadMore }
}
