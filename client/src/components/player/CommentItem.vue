<template>
  <div class="comment-item">
    <img class="comment-avatar" :src="commentItem.avatar" :alt="commentItem.name" />
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-name">{{ commentItem.name }}</span>
        <span class="comment-time">{{ formatTime(commentItem.ctime) }}</span>
      </div>
      <p class="comment-content">{{ commentItem.content }}</p>
      <div class="comment-actions">
        <div class="action-like">
          <ThumbsUp :size="14" stroke-width="1.5" />
          <span v-if="commentItem.like > 0">{{ commentItem.like }}</span>
        </div>
        <div class="action-reply">
          <MessageCircle :size="14" stroke-width="1.5" />
          <span>回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentItem as CItem } from '../../../../shared/types/video'
import { ThumbsUp, MessageCircle } from 'lucide-vue-next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

defineProps<{
  commentItem: CItem
}>()

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
.comment-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
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
</style>
