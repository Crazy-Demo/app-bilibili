<template>
  <div class="video-desc" v-if="pubdate">
    <div class="pubdate">{{ formatDate(pubdate) }}</div>
    <div class="desc-text" :class="{ expanded }" ref="descRef">
      {{ desc }}
    </div>
    <span v-if="showToggle" class="toggle-btn" @click="expanded = !expanded">
      {{ expanded ? '收起' : '展开' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps<{
  desc: string
  pubdate: number
}>()

const expanded = ref(false)
const descRef = ref<HTMLDivElement>()

const showToggle = ref(false)

function formatDate(ts: number): string {
  const d = dayjs(ts * 1000)
  const now = dayjs()
  const diffDays = now.diff(d, 'day')
  if (diffDays < 1) return d.fromNow()
  if (diffDays < 30) return `${diffDays}天前`
  if (diffDays < 365) return d.format('MM月DD日')
  return d.format('YYYY年MM月DD日')
}

onMounted(() => {
  if (descRef.value && descRef.value.scrollHeight > descRef.value.clientHeight) {
    showToggle.value = true
  }
})
</script>

<style scoped>
.video-desc {
  padding: 0 16px 12px;
}
.pubdate {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.desc-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
.desc-text.expanded {
  -webkit-line-clamp: unset;
}
.toggle-btn {
  font-size: 12px;
  color: var(--pink-primary);
  cursor: pointer;
  display: inline-block;
  margin-top: 4px;
}
</style>
