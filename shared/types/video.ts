export interface VideoItem {
  bvid: string
  title: string
  cover: string
  duration: string
  playCount: string
  danmakuCount: string
  author: string
  authorAvatar: string
}

export interface VideoDetail extends VideoItem {
  desc: string
  pubdate: number
  stat: {
    view: number
    danmaku: number
    reply: number
    favorite: number
    coin: number
    share: number
    like: number
  }
  owner: {
    mid: number
    name: string
    face: string
  }
}

export interface CommentItem {
  rpid: number
  mid: number
  name: string
  avatar: string
  content: string
  like: number
  ctime: number
  replies?: CommentItem[]
}

export interface VideoFeedResponse {
  videos: VideoItem[]
  total: number
}
