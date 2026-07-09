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
    </div>

    <van-share-sheet
      v-model:show="shareSheetVisible"
      :options="shareOptions"
      @select="onShareSelect"
    />

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
import { usePlayer } from '../composables/usePlayer'
import { useDanmaku } from '../composables/useDanmaku'
import { useHistoryStore } from '../stores/history'
import NetworkError from '../components/common/NetworkError.vue'
import EmptyState from '../components/common/EmptyState.vue'
import DanmakuControl from '../components/player/DanmakuControl.vue'
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
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: 'QQ', icon: 'qq' },
  { name: '复制链接', icon: 'link' },
]

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
</style>
