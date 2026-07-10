<template>
  <div class="fullplayer" @click="toggleControls">
    <!-- Full viewport ArtPlayer -->
    <div ref="containerRef" class="fullplayer-container"></div>

    <div v-if="loading" class="fullplayer-loading">
      <van-loading size="48" type="spinner" color="#fff" />
    </div>

    <div v-if="error" class="fullplayer-error">
      <span class="error-text">{{ error }}</span>
      <van-button size="small" plain hairline color="#fff" @click.stop="retryLoad">重试</van-button>
    </div>

    <!-- Overlay controls -->
    <transition name="fade">
      <div v-if="controlsVisible" class="overlay" @click.stop>
        <!-- Top: exit button -->
        <div class="top-bar">
          <van-button
            class="exit-btn"
            icon="arrow-left"
            plain
            hairline
            color="#fff"
            size="small"
            @click="exitFullscreen"
          >
            退出全屏
          </van-button>
        </div>

        <!-- Bottom controls -->
        <div class="bottom-bar">
          <!-- Progress bar -->
          <div class="progress-row">
            <van-slider
              v-model="seekProgress"
              :min="0"
              :max="100"
              :step="0.1"
              bar-color="var(--pink-primary)"
              active-color="var(--pink-primary)"
              @change="onSeek"
            />
          </div>

          <div class="controls-row">
            <div class="controls-left">
              <van-button
                class="ctrl-btn"
                icon="play-circle"
                :icon-prefix="isPlaying ? '' : ''"
                plain
                hairline
                color="#fff"
                size="small"
                @click="togglePlay"
              >
                {{ isPlaying ? '暂停' : '播放' }}
              </van-button>
              <span class="time-display">{{ currentTimeDisplay }} / {{ durationDisplay }}</span>
            </div>

            <div class="controls-right">
              <van-button
                class="ctrl-btn"
                plain
                hairline
                color="#fff"
                size="small"
                @click="showQuality = !showQuality"
              >
                画质
              </van-button>
              <van-button
                class="ctrl-btn"
                plain
                hairline
                color="#fff"
                size="small"
                @click="showEpisodes = !showEpisodes"
              >
                选集
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Quality popup -->
    <van-action-sheet v-model:show="showQuality" title="画质选择" :actions="qualityOptions" @select="onQualitySelect" />

    <!-- Episodes popup (mock) -->
    <van-action-sheet v-model:show="showEpisodes" title="选集" :actions="episodeOptions" @select="onEpisodeSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import ArtPlayer from 'artplayer'
import { videoApi } from '../api/video'

const route = useRoute()
const router = useRouter()

const containerRef = ref<HTMLDivElement>()
const player = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const controlsVisible = ref(true)
const isPlaying = ref(true)
const seekProgress = ref(0)
const currentTime = ref(0)
const duration = ref(0)
let controlsTimer: ReturnType<typeof setTimeout> | null = null

const showQuality = ref(false)
const showEpisodes = ref(false)

const qualityOptions = [
  { name: '4K', value: '4k' },
  { name: '1080P', value: '1080p' },
  { name: '720P', value: '720p' },
  { name: '480P', value: '480p' },
]

const episodeOptions = [
  { name: '第1话', value: '1' },
  { name: '第2话', value: '2' },
  { name: '第3话', value: '3' },
]

const currentTimeDisplay = computed(() => formatTime(currentTime.value))
const durationDisplay = computed(() => formatTime(duration.value))

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

async function loadAndPlay(bvid: string) {
  loading.value = true
  error.value = null
  try {
    const { data: playData } = await videoApi.getPlayUrl(bvid)
    const url = (playData?.url || '')

    if (containerRef.value) {
      player.value = new ArtPlayer({
        container: containerRef.value,
        url,
        autoplay: true,
        muted: false,
        autoSize: true,
        fullscreen: true,
        setting: true,
        hotkey: true,
        mutex: true,
        theme: '#FB7299',
        volume: 0.7,
      })

      player.value.on('play', () => { isPlaying.value = true })
      player.value.on('pause', () => { isPlaying.value = false })
      player.value.on('timeupdate', () => {
        if (player.value) {
          currentTime.value = player.value.currentTime
          duration.value = player.value.duration
          seekProgress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
        }
      })
    }
  } catch (err) {
    error.value = '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

function toggleControls() {
  controlsVisible.value = !controlsVisible.value
  if (controlsVisible.value) startControlsTimer()
}

function startControlsTimer() {
  if (controlsTimer) clearTimeout(controlsTimer)
  controlsTimer = setTimeout(() => {
    controlsVisible.value = false
  }, 3000)
}

function stopControlsTimer() {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
    controlsTimer = null
  }
}

function togglePlay() {
  if (!player.value) return
  isPlaying.value ? player.value.pause() : player.value.play()
}

function onSeek(val: number) {
  if (!player.value || duration.value <= 0) return
  player.value.seek = (val / 100) * duration.value
}

function onQualitySelect(option: any) {
  showToast(`画质切换至: ${option.name}`)
  showQuality.value = false
}

function onEpisodeSelect(option: any) {
  showToast(`选集: ${option.name}`)
  showEpisodes.value = false
}

function exitFullscreen() {
  player.value?.destroy()
  router.back()
}

function retryLoad() {
  const bvid = route.params.bvid as string
  if (bvid) loadAndPlay(bvid)
}

onMounted(() => {
  const bvid = route.params.bvid as string
  if (bvid) loadAndPlay(bvid)
  startControlsTimer()
})

onBeforeUnmount(() => {
  stopControlsTimer()
  player.value?.destroy()
  player.value = null
})
</script>

<style scoped>
.fullplayer {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  z-index: 1000;
}

.fullplayer-container {
  width: 100%;
  height: 100%;
}

.fullplayer-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.fullplayer-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.7);
}

.error-text {
  color: #fff;
  font-size: 14px;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%);
  pointer-events: none;
}

.overlay > * {
  pointer-events: auto;
}

.top-bar {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.exit-btn {
  --van-button-font-size: 13px;
  --van-button-border-color: rgba(255,255,255,0.8);
}

.bottom-bar {
  padding: 12px 16px 24px;
}

.progress-row {
  margin-bottom: 12px;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctrl-btn {
  --van-button-font-size: 12px;
  --van-button-border-color: rgba(255,255,255,0.6);
}

.time-display {
  font-size: 12px;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
