import type { VideoItem, VideoDetail, CommentItem, VideoFeedResponse } from '../../../shared/types/video'
import type { UserProfile } from '../../../shared/types/user'
import type { ApiResponse } from '../../../shared/types/api'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const BVID_PREFIX = 'BV1'

function generateBvid(index: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = BVID_PREFIX
  for (let i = 0; i < 10; i++) id += chars[(index + i * 7) % chars.length]
  return id
}

const mockVideos: VideoItem[] = Array.from({ length: 50 }, (_, i) => ({
  bvid: generateBvid(i),
  title: `【4K】超清测试视频 #${i + 1} —— 这是一段很长的标题用来测试布局效果`,
  cover: `https://picsum.photos/seed/vid${i}/400/224`,
  duration: `${Math.floor(Math.random() * 30 + 1)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
  playCount: `${(Math.random() * 1000 + 1).toFixed(0)}万`,
  danmakuCount: `${Math.floor(Math.random() * 10000)}`,
  author: `UP主_${String.fromCharCode(65 + (i % 26))}${Math.floor(Math.random() * 100)}`,
  authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=user${i}`,
}))

const mockVideoDetails: Record<string, VideoDetail> = {}

function getDetail(v: VideoItem): VideoDetail {
  if (mockVideoDetails[v.bvid]) return mockVideoDetails[v.bvid]
  const detail: VideoDetail = {
    ...v,
    desc: `这是视频《${v.title}》的简介。该视频用于测试 Bilibili 客户端的视频播放、评论、推荐等功能。模拟数据提供了完整的视频详情结构。#测试 #Bilibili #4K`,
    pubdate: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
    stat: {
      view: Math.floor(Math.random() * 1000000 + 1000),
      danmaku: Math.floor(Math.random() * 50000),
      reply: Math.floor(Math.random() * 10000),
      favorite: Math.floor(Math.random() * 50000),
      coin: Math.floor(Math.random() * 30000),
      share: Math.floor(Math.random() * 10000),
      like: Math.floor(Math.random() * 200000 + 100),
    },
    owner: {
      mid: Math.floor(Math.random() * 10000000 + 1000),
      name: v.author,
      face: v.authorAvatar,
    },
  }
  mockVideoDetails[v.bvid] = detail
  return detail
}

function getMockComments(bvid: string, page: number = 1, pageSize: number = 10): CommentItem[] {
  const comments: CommentItem[] = []
  for (let i = 0; i < pageSize; i++) {
    const idx = (page - 1) * pageSize + i
    const comment: CommentItem = {
      rpid: idx + 1,
      mid: Math.floor(Math.random() * 10000000),
      name: `评论用户_${String.fromCharCode(97 + (idx % 26))}${idx}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=comment${idx}`,
      content: [
        '这个视频太棒了，画质清晰！',
        '前排打卡，祝UP主越来越好！',
        '三连支持，期待更多优质内容~',
        '科普时间到！这里补充一点背景知识...',
        '哈哈哈，这里笑死我了',
        '请问用的什么设备拍摄的？',
        '收藏了，以后慢慢看',
        '每天一遍，净化心灵',
        '有没有人和我一样看了三遍的？',
        '第一次这么靠前，好紧张',
      ][idx % 10],
      like: Math.floor(Math.random() * 5000),
      ctime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7),
    }
    if (idx % 3 === 0) {
      comment.replies = [
        {
          rpid: idx * 100 + 1,
          mid: Math.floor(Math.random() * 10000000),
          name: `回复用户_A`,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=reply${idx}`,
          content: '同意！确实很棒',
          like: Math.floor(Math.random() * 100),
          ctime: comment.ctime + 3600,
        },
        {
          rpid: idx * 100 + 2,
          mid: Math.floor(Math.random() * 10000000),
          name: `回复用户_B`,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=reply${idx + 1}`,
          content: '+1，已三连',
          like: Math.floor(Math.random() * 50),
          ctime: comment.ctime + 7200,
        },
      ]
    }
    comments.push(comment)
  }
  return comments
}

const mockUserProfiles: Record<number, UserProfile> = {
  1: { mid: 1, name: '测试用户', face: 'https://api.dicebear.com/7.x/bottts/svg?seed=testuser', level: 6, following: 128, followers: 9999, likes: 88888 },
  100001: { mid: 100001, name: 'UP主_测试', face: 'https://api.dicebear.com/7.x/bottts/svg?seed=up100001', level: 5, following: 56, followers: 125000, likes: 520000 },
}

const hotSearchKeywords = [
  'Bilibili年度大会员', '4K高清视频', 'Vue3前端教程', 'TypeScript从入门到精通',
  '每周必看', '热门舞蹈挑战', '最新番剧推荐', '科技数码评测',
  '美食探店', '旅行VLOG', '音乐现场', '游戏实况',
  '知识科普', '搞笑合集', '影视剪辑', '动漫混剪',
]

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

export async function getFeed(page: number = 1, pageSize: number = 10, _sort: string = 'hot'): Promise<ApiResponse<VideoFeedResponse>> {
  const start = (page - 1) * pageSize
  const items = mockVideos.slice(start, start + pageSize)
  return {
    code: 0,
    message: 'success',
    data: { videos: items, total: mockVideos.length },
  }
}

export async function getVideoDetail(bvid: string): Promise<ApiResponse<VideoDetail>> {
  const video = mockVideos.find(v => v.bvid === bvid)
  if (!video) {
    return { code: -404, message: '视频不存在', data: null as any }
  }
  return { code: 0, message: 'success', data: getDetail(video) }
}

export async function getPlayUrl(bvid: string): Promise<ApiResponse<{ url: string; quality: string[] }>> {
  const video = mockVideos.find(v => v.bvid === bvid)
  if (!video) {
    return { code: -404, message: '视频不存在', data: null as any }
  }
  return {
    code: 0,
    message: 'success',
    data: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      quality: ['1080P', '720P', '480P'],
    },
  }
}

export async function getComments(bvid: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<{ comments: CommentItem[]; total: number }>> {
  const total = 128
  const comments = getMockComments(bvid, page, pageSize)
  return { code: 0, message: 'success', data: { comments, total } }
}

export async function getRelated(bvid: string): Promise<ApiResponse<VideoItem[]>> {
  // Return 6 random videos excluding the current one
  const related = mockVideos.filter(v => v.bvid !== bvid).sort(() => Math.random() - 0.5).slice(0, 6)
  return { code: 0, message: 'success', data: related }
}

export async function search(keyword: string, page: number = 1): Promise<ApiResponse<{ videos: VideoItem[]; total: number }>> {
  const filtered = mockVideos.filter(v => v.title.includes(keyword) || v.author.includes(keyword))
  const start = (page - 1) * 20
  const items = filtered.slice(start, start + 20)
  return { code: 0, message: 'success', data: { videos: items.length > 0 ? items : mockVideos.slice(0, 10), total: filtered.length || 50 } }
}

export async function getHotSearch(): Promise<ApiResponse<string[]>> {
  return { code: 0, message: 'success', data: hotSearchKeywords }
}

export async function getSearchSuggest(keyword: string): Promise<ApiResponse<string[]>> {
  const suggestions = hotSearchKeywords
    .filter(k => k.includes(keyword) || keyword.includes(k))
    .slice(0, 5)
  return { code: 0, message: 'success', data: suggestions.length > 0 ? suggestions : hotSearchKeywords.slice(0, 5) }
}

export async function getUserProfile(uid: number): Promise<ApiResponse<UserProfile>> {
  const profile = mockUserProfiles[uid] || {
    mid: uid,
    name: `用户_${uid}`,
    face: `https://api.dicebear.com/7.x/bottts/svg?seed=uid${uid}`,
    level: Math.floor(Math.random() * 6) + 1,
    following: Math.floor(Math.random() * 500),
    followers: Math.floor(Math.random() * 100000),
    likes: Math.floor(Math.random() * 500000),
  }
  return { code: 0, message: 'success', data: profile }
}
