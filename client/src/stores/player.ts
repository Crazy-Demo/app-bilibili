import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const bvid = ref<string | null>(null)
  const cid = ref<string | null>(null)
  const isPlaying = ref(false)
  const danmakuEnabled = ref(true)
  const currentTime = ref(0)
  const isActive = computed(() => !!bvid.value)

  function play(videoBvid: string, videoCid?: string) {
    bvid.value = videoBvid
    if (videoCid) cid.value = videoCid
    isPlaying.value = true
  }
  function pause() { isPlaying.value = false }
  function toggleDanmaku() { danmakuEnabled.value = !danmakuEnabled.value }
  function close() { bvid.value = null; cid.value = null; isPlaying.value = false }

  return { bvid, cid, isPlaying, danmakuEnabled, currentTime, isActive, play, pause, toggleDanmaku, close }
})
