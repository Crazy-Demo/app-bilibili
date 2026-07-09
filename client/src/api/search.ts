import apiClient from './client'
import type { VideoItem } from '../../../shared/types/video'

export const searchApi = {
  search: (keyword: string, page: number = 1) =>
    apiClient.get<{ results: VideoItem[] }>('/search', { params: { keyword, page } }),
  getHot: () => apiClient.get<{ keywords: string[] }>('/search/hot'),
  suggest: (keyword: string) =>
    apiClient.get<{ suggestions: string[] }>('/search/suggest', { params: { keyword } }),
}
