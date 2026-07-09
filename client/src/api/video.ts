import apiClient from './client'
import type { VideoDetail, CommentItem } from '../../../shared/types/video'

export const videoApi = {
  getDetail: (bvid: string) =>
    apiClient.get<VideoDetail>(`/video/${bvid}`),
  getPlayUrl: (bvid: string) =>
    apiClient.get<{ url: string; quality: string[] }>(`/video/${bvid}/playurl`),
  getComments: (bvid: string, page: number = 1, sort: 'hot' | 'new' = 'hot') =>
    apiClient.get<{ comments: CommentItem[]; total: number }>(`/video/${bvid}/comments`, { params: { page, sort } }),
  getRelated: (bvid: string) =>
    apiClient.get<{ videos: VideoDetail[] }>(`/video/${bvid}/related`),
}
