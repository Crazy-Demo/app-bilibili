import { ref, shallowRef } from 'vue'
import ArtPlayer from 'artplayer'
import type { VideoDetail, CommentItem } from '../../../shared/types/video'
import { videoApi } from '../api/video'

export function usePlayer() {
  const player = shallowRef<any>(null)
  const containerRef = ref<HTMLDivElement>()
  const detail = ref<VideoDetail | null>(null)
  const comments = ref<CommentItem[]>([])
  const related = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAndPlay(bvid: string) {
    loading.value = true; error.value = null
    try {
      const [{ data: playData }, { data: detailData }, { data: commentData }, { data: relatedData }] =
        await Promise.all([
          videoApi.getPlayUrl(bvid),
          videoApi.getDetail(bvid),
          videoApi.getComments(bvid, 1),
          videoApi.getRelated(bvid),
        ])
      detail.value = detailData.data || (detailData as any)
      comments.value = (commentData.data?.comments || (commentData as any)?.comments || [])
      related.value = (relatedData.data?.videos || (relatedData as any)?.videos || [])
      const url = (playData.data?.url || (playData as any)?.url || '')

      if (containerRef.value) {
        player.value = new ArtPlayer({
          container: containerRef.value, url, autoPlay: true, muted: false,
          autoMini: true, autoSize: true, playbackRate: true, aspectRatio: true,
          setting: true, hotkey: true, pip: true, mutex: true,
          fullscreen: true, fullscreenWeb: true,
          danmuku: { id: bvid, api: '/api/video/' + bvid + '/danmaku' },
          theme: '#FB7299',
        })
      }
    } catch (err) { error.value = '加载失败，请重试' }
    finally { loading.value = false }
  }

  function destroy() { player.value?.destroy(); player.value = null }

  return { containerRef, player, detail, comments, related, loading, error, loadAndPlay, destroy }
}
