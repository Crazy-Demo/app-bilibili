import { defineStore } from 'pinia'
import { ref } from 'vue'

const MAX_HISTORY = 20

export const useHistoryStore = defineStore('history', () => {
  const searchHistory = ref<string[]>([])
  const playbackHistory = ref<Array<{ bvid: string; title: string; cover: string; timestamp: number }>>([])

  function addSearch(keyword: string) {
    searchHistory.value = [keyword, ...searchHistory.value.filter(k => k !== keyword)].slice(0, MAX_HISTORY)
  }
  function clearSearch() { searchHistory.value = [] }
  function addPlayback(video: { bvid: string; title: string; cover: string }) {
    playbackHistory.value = [{ ...video, timestamp: Date.now() }, ...playbackHistory.value.filter(v => v.bvid !== video.bvid)].slice(0, MAX_HISTORY)
  }

  return { searchHistory, playbackHistory, addSearch, clearSearch, addPlayback }
}, { persist: true })
