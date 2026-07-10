<template>
  <div class="comment-detail-page">
    <van-nav-bar
      title="评论详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- Parent comment -->
    <div class="parent-comment">
      <div class="comment-item">
        <img
          class="comment-avatar"
          :src="parentComment.avatar"
          :alt="parentComment.name"
        />
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-name">{{ parentComment.name }}</span>
            <span class="comment-time">{{ formatTime(parentComment.ctime) }}</span>
          </div>
          <p class="comment-content">{{ parentComment.content }}</p>
          <div class="comment-actions">
            <div class="action-like">
              <ThumbsUp :size="14" stroke-width="1.5" />
              <span v-if="parentComment.like > 0">{{ parentComment.like }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply count divider -->
    <div class="reply-divider">
      <span class="reply-title">回复 ({{ replies.length }})</span>
    </div>

    <!-- Nested replies -->
    <div class="replies-list" ref="repliesRef">
      <template v-for="reply in replies" :key="reply.rpid">
        <div
          class="comment-item"
          :class="{ 'reply-item': true, 'reply-new': reply.isNew }"
        >
          <img
            class="comment-avatar"
            :src="reply.avatar"
            :alt="reply.name"
          />
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-name">{{ reply.name }}</span>
              <span class="comment-time">{{ formatTime(reply.ctime) }}</span>
            </div>
            <p class="comment-content">{{ reply.content }}</p>
            <div class="comment-actions">
              <div class="action-like">
                <ThumbsUp :size="14" stroke-width="1.5" />
                <span v-if="reply.like > 0">{{ reply.like }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Fixed bottom input bar -->
    <div class="reply-input-bar">
      <van-field
        v-model="replyText"
        class="reply-field"
        placeholder="说点什么..."
        :border="false"
        rows="1"
        autosize
        maxlength="500"
        @keypress.enter="sendReply"
      />
      <button
        class="send-btn"
        :class="{ 'send-btn-active': replyText.trim().length > 0 }"
        :disabled="!replyText.trim()"
        @click="sendReply"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ThumbsUp } from 'lucide-vue-next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const route = useRoute()
const rpid = route.params.rpid as string

// --- Mock parent comment ---
const parentComment = ref({
  rpid: Number(rpid),
  mid: 12345678,
  name: '哔哩哔哩用户',
  avatar: 'https://i0.hdslb.com/bfs/face/member/noface.jpg',
  content: '这个视频太棒了，UP主加油！期待下一期作品！',
  like: 256,
  ctime: Math.floor(Date.now() / 1000) - 86400 * 2,
})

// --- Mock replies ---
const replyNames = [
  '二次元爱好者', '科技达人', '音乐迷', '游戏玩家',
  '动漫追番人', '美食家', '旅行者', '学习UP主',
  '电影爱好者', '生活分享家',
]
const replyContents = [
  '说得对，我也这么觉得！',
  '前排围观，up主辛苦了',
  '哈哈哈，这评论太真实了',
  '确实，这一期质量很高',
  '希望大家多多三连支持',
  '看完直接关注了',
  '收藏了，以后慢慢看',
  '这个观点很新颖，学到了',
  '我也是从这个视频入坑的',
  '期待下一期！',
]

const replies = ref(
  Array.from({ length: 10 }, (_, i) => ({
    rpid: Number(rpid) * 100 + i,
    mid: 10000000 + i,
    name: replyNames[i],
    avatar: `https://i0.hdslb.com/bfs/face/member/noface.jpg`,
    content: replyContents[i],
    like: Math.floor(Math.random() * 120),
    ctime: Math.floor(Date.now() / 1000) - i * 3600,
    isNew: false,
  }))
)

const replyText = ref('')
const repliesRef = ref<HTMLElement | null>(null)

function sendReply() {
  const text = replyText.value.trim()
  if (!text) return

  const now = Math.floor(Date.now() / 1000)
  replies.value.push({
    rpid: now,
    mid: 0,
    name: '我',
    avatar: 'https://i0.hdslb.com/bfs/face/member/noface.jpg',
    content: text,
    like: 0,
    ctime: now,
    isNew: true,
  })

  replyText.value = ''

  nextTick(() => {
    if (repliesRef.value) {
      repliesRef.value.scrollTop = repliesRef.value.scrollHeight
    }
  })
}

function formatTime(ts: number): string {
  const d = dayjs(ts * 1000)
  const now = dayjs()
  const diff = now.diff(d, 'day')
  if (diff < 1) return d.fromNow()
  if (diff < 30) return `${diff}天前`
  return d.format('MM-DD')
}
</script>

<style scoped>
.comment-detail-page {
  min-height: 100vh;
  background: var(--bg-white);
  padding-bottom: 56px;
}

/* Parent comment */
.parent-comment {
  padding-bottom: 0;
}

/* Reply divider */
.reply-divider {
  padding: 12px 16px 4px;
  border-top: 8px solid var(--bg-gray, #f5f5f5);
}
.reply-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Replies list */
.replies-list {
  display: flex;
  flex-direction: column;
}

/* Comment item (shared between parent and replies) */
.comment-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
}
.reply-item {
  padding-left: 16px;
}
.reply-new {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.comment-body {
  flex: 1;
  min-width: 0;
}
.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.comment-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.comment-time {
  font-size: 11px;
  color: var(--text-secondary);
}
.comment-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  word-break: break-word;
  margin-bottom: 6px;
}
.comment-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}
.action-like,
.action-reply {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Fixed bottom input bar */
.reply-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-white);
  border-top: 1px solid var(--border-color, #eee);
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.06);
}
.reply-field {
  flex: 1;
  background: var(--bg-gray, #f5f5f5);
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 14px;
  min-height: 36px;
}
.send-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 0 18px;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: var(--text-secondary, #999);
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn-active {
  background: var(--primary-color, #fb7299);
}
</style>
