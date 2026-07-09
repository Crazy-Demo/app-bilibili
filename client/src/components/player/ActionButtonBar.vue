<template>
  <div class="action-button-bar">
    <div class="action-item" @click="$emit('like')">
      <ThumbsUp :size="22" :stroke-width="liked ? 2.5 : 1.5" :fill="liked ? 'var(--pink-primary)' : 'none'" :color="liked ? 'var(--pink-primary)' : 'var(--text-primary)'" />
      <span class="action-count">{{ formatCount(likes) }}</span>
    </div>
    <div class="action-item" @click="$emit('coin')">
      <Banknote :size="22" stroke-width="1.5" />
      <span class="action-count">{{ formatCount(coins) }}</span>
    </div>
    <div class="action-item" @click="$emit('fav')">
      <Bookmark :size="22" :stroke-width="favved ? 2.5 : 1.5" :fill="favved ? 'var(--pink-primary)' : 'none'" :color="favved ? 'var(--pink-primary)' : 'var(--text-primary)'" />
      <span class="action-count">{{ formatCount(favs) }}</span>
    </div>
    <div class="action-item" @click="$emit('share')">
      <Share2 :size="22" stroke-width="1.5" />
      <span class="action-count">分享</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThumbsUp, Banknote, Bookmark, Share2 } from 'lucide-vue-next'

defineProps<{
  likes?: string | number
  coins?: string | number
  favs?: string | number
  liked?: boolean
  favved?: boolean
}>()

defineEmits<{
  like: []
  coin: []
  fav: []
  share: []
}>()

function formatCount(n?: string | number): string {
  if (n === undefined || n === null) return '0'
  const num = typeof n === 'string' ? parseInt(n) : n
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toString()
}
</script>

<style scoped>
.action-button-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 16px;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.action-count {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
