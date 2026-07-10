<template>
  <div class="video-desc-page">
    <van-nav-bar
      title="视频简介"
      left-arrow
      @click-left="$router.back()"
    />

    <template v-if="detail">
      <div class="content-scroll">
        <!-- Title -->
        <h1 class="desc-title">{{ detail.title }}</h1>

        <!-- Meta info -->
        <div class="meta-row">
          <span class="meta-item">发布日期: {{ formatDate(detail.pubdate) }}</span>
          <span class="meta-item">播放: {{ formatCount(detail.stat?.view) }}</span>
          <span class="meta-item">弹幕: {{ formatCount(detail.stat?.danmaku) }}</span>
        </div>

        <!-- Full description text (multiline, no clamp) -->
        <div class="desc-section">
          <h3 class="section-heading">视频简介</h3>
          <p class="desc-full">{{ detail.desc || '暂无简介' }}</p>
        </div>

        <!-- Tags row -->
        <div class="tags-row">
          <span
            v-for="tag in mockTags"
            :key="tag"
            class="tag-pill"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Action buttons -->
        <div class="action-row">
          <van-button
            class="action-btn"
            icon="warning-o"
            plain
            round
            block
            @click="handleReport"
          >
            举报
          </van-button>
          <van-button
            class="action-btn"
            icon="share-o"
            type="primary"
            round
            block
            @click="handleShare"
          >
            分享
          </van-button>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="page-empty">
      <EmptyState message="暂无视频信息" />
    </div>

    <div v-if="loading" class="page-loading">
      <van-loading size="28" type="spinner" color="var(--pink-primary)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import { videoApi } from '../api/video'
import EmptyState from '../components/common/EmptyState.vue'

const route = useRoute()

const detail = ref<any>(null)
const loading = ref(false)

const mockTags = ['搞笑', '日常', 'Vlog', '生活']

function formatDate(ts: number): string {
  const d = dayjs(ts * 1000)
  const now = dayjs()
  const diffDays = now.diff(d, 'day')
  if (diffDays < 1) return d.fromNow()
  if (diffDays < 30) return `${diffDays}天前`
  if (diffDays < 365) return d.format('MM月DD日')
  return d.format('YYYY年MM月DD日')
}

function formatCount(n?: string | number): string {
  if (n === undefined || n === null) return '0'
  const num = typeof n === 'string' ? parseInt(n) : n
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toString()
}

function handleReport() {
  showToast('感谢你的举报，我们将尽快处理')
}

function handleShare() {
  showToast('分享功能已打开')
}

onMounted(async () => {
  const bvid = route.params.bvid as string
  if (!bvid) return
  loading.value = true
  try {
    const { data } = await videoApi.getDetail(bvid)
    detail.value = data
  } catch {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.video-desc-page {
  min-height: 100vh;
  background: var(--bg-white);
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.desc-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-item {
  font-size: 12px;
  color: var(--text-secondary);
}

.desc-section {
  margin-bottom: 16px;
}

.section-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.desc-full {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-pill {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-gray);
  border-radius: var(--radius-full);
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 8px;
}

.action-btn {
  flex: 1;
}

.page-empty {
  padding: 48px 0;
}

.page-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
</style>
