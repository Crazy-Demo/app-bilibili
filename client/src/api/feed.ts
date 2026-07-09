import apiClient from './client'
import type { VideoFeedResponse } from '../../../shared/types/video'

export const feedApi = {
  getFeed: (page: number = 1, pageSize: number = 10) =>
    apiClient.get<VideoFeedResponse>('/video/feed', { params: { page, pageSize } }),
}
