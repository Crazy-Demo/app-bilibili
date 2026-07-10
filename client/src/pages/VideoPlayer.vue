<template>
  <div class="video-player-page">
    <van-nav-bar
      title="视频详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- Player area -->
    <div class="player-wrap">
      <div ref="containerRef" class="artplayer-container"></div>
      <div v-if="loading" class="player-loading">
        <van-loading size="36" type="spinner" color="#fff" />
      </div>
      <div v-if="error" class="player-error">
        <NetworkError :message="error" @retry="retryLoad" />
      </div>
      <div class="fullscreen-btn" @click="goFullPlayer">
        <Maximize2 :size="18" stroke-width="2" color="#fff" />
      </div>
    </div>

    <!-- DanmakuSettings modal -->
    <DanmakuSettings
      :show="dm.showSettings.value"
      :opacity="dm.opacity.value"
      :font-size="dm.fontSize.value <= 20 ? 'small' : dm.fontSize.value >= 30 ? 'large' : 'medium'"
      speed="normal"
      color="#FFFFFF"
      shieldKeywords=""
      @close="dm.showSettings.value = false"
      @update="onDanmakuSettingsUpdate"
    />

    <!-- Enhanced ShareSheet -->
    <van-popup
      v-model:show="shareSheetVisible"
      position="bottom"
      round
      :style="{ padding: '20px 16px', maxHeight: '60vh' }"
    >
      <h3 class="share-title">分享到</h3>
      <div class="share-grid">
        <div
          v-for="opt in shareOptions"
          :key="opt.name"
          class="share-item"
          @click="onShareSelect(opt)"
        >
          <div
            class="share-icon-wrap"
            :style="{ backgroundColor: opt.bgColor || 'var(--bg-gray)' }"
          >
            <span class="share-icon-text">{{ opt.icon }}</span>
          </div>
          <span class="share-name">{{ opt.name }}</span>
        </div>
      </div>

      <div class="share-divider" />

      <van-button round block class="share-copy-btn" @click="handleCopyLink">
        复制链接
      </van-button>

      <div class="share-qr-placeholder">
        <div class="qr-mock">
          <span class="qr-icon">QR</span>
        </div>
        <span class="qr-label">扫码观看</span>
      </div>
    </van-popup>

    <!-- Content loaded state -->
    <template v-if="detail">
      <DanmakuControl
        :enabled="dm.enabled.value"
        @toggle="dm.toggle"
        @send="dm.sendDm"
        @settings="dm.showSettings.value = !dm.showSettings.value"
      />

      <ActionButtonBar
        :likes="detail.stat.like"
        :coins="detail.stat.coin"
        :favs="detail.stat.favorite"
        @like="handleLike"
        @coin="handleCoin"
        @fav="handleFav"
        @share="onShare"
      />

      <div class="title-section">
        <h1 class="video-title">{{ detail.title }}</h1>
      </div>

      <CreatorInfoBar
        :avatar="detail.owner.face"
        :name="detail.owner.name"
        :subs="detail.stat.view + '次观看'"
        @follow="handleFollow"
      />

      <VideoDesc
        :desc="detail.desc"
        :pubdate="detail.pubdate"
      />
      <div class="desc-actions">
        <span class="desc-nav-link" @click="goVideoDesc">查看完整简介 &gt;</span>
      </div>

      <!-- Comments -->
      <div class="comments-section">
        <h3 class="section-title">评论 ({{ detail.stat.reply }})</h3>

        <RecycleScroller
          v-if="comments.length > 50"
          class="scroller"
          :items="comments"
          :item-size="80"
          key-field="rpid"
          v-slot="{ item }"
        >
          <CommentItem :comment-item="item" />
        </RecycleScroller>

        <div v-else-if="comments.length > 0" class="comments-list">
          <CommentItem v-for="item in comments" :key="item.rpid" :comment-item="item" />
        </div>

        <EmptyState v-else message="暂无评论" />
      </div>

      <RecommendedVideo :videos="related" />
    </template>

    <div v-else-if="!loading" class="page-empty">
      <EmptyState message="暂无视频信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { showToast } from 'vant'
import { Maximize2 } from 'lucide-vue-next'
import { usePlayer } from '../composables/usePlayer'
import { useDanmaku } from '../composables/useDanmaku'
import { useHistoryStore } from '../stores/history'
import NetworkError from '../components/common/NetworkError.vue'
import EmptyState from '../components/common/EmptyState.vue'
import DanmakuControl from '../components/player/DanmakuControl.vue'
import DanmakuSettings from '../components/player/DanmakuSettings.vue'
import ActionButtonBar from '../components/player/ActionButtonBar.vue'
import CreatorInfoBar from '../components/player/CreatorInfoBar.vue'
import VideoDesc from '../components/player/VideoDesc.vue'
import CommentItem from '../components/player/CommentItem.vue'
import RecommendedVideo from '../components/player/RecommendedVideo.vue'

const route = useRoute()
const router = useRouter()

const player = usePlayer()
const dm = useDanmaku(player.player)
const history = useHistoryStore()

const shareSheetVisible = ref(false)
const shareOptions = [
  { name: '微信', icon: 'WX', bgColor: '#07C160' },
  { name: '微博', icon: 'WB', bgColor: '#FF8200' },
  { name: 'QQ', icon: 'QQ', bgColor: '#12B7F5' },
]

function onDanmakuSettingsUpdate(settings: { opacity: number; fontSize: string; speed: string; color: string; shieldKeywords: string }) {
  dm.opacity.value = settings.opacity

  const fontSizeMap: Record<string, number> = { small: 20, medium: 24, large: 30 }
  dm.fontSize.value = fontSizeMap[settings.fontSize] || 24
}

function retryLoad() {
  const bvid = route.params.bvid as string
  if (bvid) player.loadAndPlay(bvid)
}

onMounted(() => {
  const bvid = route.params.bvid as string
  if (bvid) {
    player.loadAndPlay(bvid)
  }
})

watch(() => player.detail.value, (detail) => {
  if (detail) {
    history.addPlayback({
      bvid: detail.bvid,
      title: detail.title,
      cover: detail.cover,
    })
  }
})

onBeforeUnmount(() => {
  player.destroy()
})

// Actions
function handleLike() {
  showToast('已点赞')
}

function handleCoin() {
  showToast('投币成功')
}

function handleFav() {
  showToast('已收藏')
}

function handleFollow() {
  showToast('已关注')
}

function handleShare() {
  shareSheetVisible.value = true
}

function onShareSelect(option: any) {
  showToast(`分享到${option.name}`)
}

async function handleCopyLink() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    showToast('链接已复制')
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showToast('链接已复制')
  }
}

function goFullPlayer() {
  const bvid = route.params.bvid as string
  router.push(`/video/${bvid}/fullscreen`)
}

function goVideoDesc() {
  const bvid = route.params.bvid as string
  router.push(`/video/${bvid}/desc`)
}

function onShare() {
  handleShare()
}
</script>

<style scoped>
.video-player-page {
  min-height: 100vh;
  background: var(--bg-white);
  padding-bottom: 24px;
}

.player-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
}
.artplayer-container {
  width: 100%;
  height: 100%;
}
.player-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
}
.player-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
}

.title-section {
  padding: 8px 16px 4px;
}
.video-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.comments-section {
  padding: 12px 0;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  padding: 0 16px 8px;
  color: var(--text-primary);
}
.scroller {
  height: 60vh;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

.page-empty {
  padding: 48px 0;
}

.fullscreen-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
}

.desc-actions {
  padding: 0 16px 8px;
}

.desc-nav-link {
  font-size: 12px;
  color: var(--pink-primary);
  cursor: pointer;
}

.share-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 20px;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  justify-items: center;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.share-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon-text {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.share-name {
  font-size: 11px;
  color: var(--text-secondary);
}

.share-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 12px 0;
}

.share-copy-btn {
  margin-bottom: 12px;
}

.share-qr-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  justify-content: center;
}

.qr-mock {
  width: 48px;
  height: 48px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-icon {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.qr-label {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
