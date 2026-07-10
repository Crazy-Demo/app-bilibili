<template>
  <div class="live-stream-page">
    <van-nav-bar
      title="直播"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- Player area -->
    <div class="player-area">
      <span class="live-badge">直播</span>
      <div class="play-overlay">
        <van-icon name="play-circle-o" class="play-icon" />
      </div>
    </div>

    <!-- Streamer info bar -->
    <div class="streamer-info-bar">
      <img
        class="avatar"
        src="https://picsum.photos/seed/streamer/80/80"
        alt="streamer-avatar"
      />
      <div class="info">
        <span class="name">哔哩哔哩直播君</span>
        <span class="viewers">
          <van-icon name="eye-o" class="viewer-icon" />
          {{ formatViewerCount(viewerCount) }} 观看
        </span>
      </div>
      <van-button
        round
        type="primary"
        size="small"
        class="follow-btn"
        :class="{ followed: isFollowed }"
        @click="toggleFollow"
      >
        {{ isFollowed ? '已关注' : '+ 关注' }}
      </van-button>
    </div>

    <!-- Live chat messages -->
    <div class="chat-section" ref="chatRef">
      <div class="chat-header">
        <span class="chat-title">弹幕</span>
        <span class="chat-count">{{ messages.length }} 条消息</span>
      </div>
      <div class="chat-messages" ref="messagesRef">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="chat-message"
          :class="msg.type"
        >
          <span class="msg-time">{{ msg.time }}</span>
          <span v-if="msg.type === 'gift'" class="gift-badge">
            <van-icon name="like" />
          </span>
          <span v-else-if="msg.type === 'welcome'" class="welcome-badge">
            欢迎
          </span>
          <span class="msg-user">{{ msg.user }}</span>
          <span class="msg-text">{{ msg.text }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom input bar -->
    <div class="input-bar">
      <van-field
        v-model="inputText"
        placeholder="说点什么..."
        :border="false"
        class="chat-input"
        @keypress.enter="sendMessage"
      />
      <van-button
        round
        class="emoji-btn"
        icon="smile-o"
        @click="toggleEmoji"
      />
      <van-button
        round
        type="primary"
        size="small"
        class="send-btn"
        :disabled="!inputText.trim()"
        @click="sendMessage"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { showToast } from 'vant'

const viewerCount = ref(128369)
const isFollowed = ref(false)
const inputText = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const showEmoji = ref(false)

interface ChatMessage {
  id: number
  type: 'normal' | 'gift' | 'welcome'
  user: string
  text: string
  time: string
}

const mockMessages: ChatMessage[] = [
  { id: 1, type: 'welcome', user: '星辰大海', text: '进入直播间', time: '12:00' },
  { id: 2, type: 'normal', user: '追风少年', text: '终于开播了！等了好久', time: '12:00' },
  { id: 3, type: 'gift', user: '月下独酌', text: '送出了小电视', time: '12:01' },
  { id: 4, type: 'normal', user: '樱花雨', text: '主播加油！', time: '12:01' },
  { id: 5, type: 'welcome', user: '九天揽月', text: '进入直播间', time: '12:01' },
  { id: 6, type: 'normal', user: '清风徐来', text: '今天播什么内容啊', time: '12:02' },
  { id: 7, type: 'gift', user: '星河万里', text: '送出了B坷垃', time: '12:02' },
  { id: 8, type: 'normal', user: '墨染青衣', text: '画质好清晰', time: '12:03' },
  { id: 9, type: 'welcome', user: '长安故里', text: '进入直播间', time: '12:03' },
  { id: 10, type: 'normal', user: '南风知意', text: '来了来了', time: '12:04' },
  { id: 11, type: 'gift', user: '醉里挑灯', text: '送出了小电视', time: '12:04' },
  { id: 12, type: 'normal', user: '山河远阔', text: '有没有组队的', time: '12:05' },
  { id: 13, type: 'welcome', user: '人间烟火', text: '进入直播间', time: '12:05' },
  { id: 14, type: 'normal', user: '踏雪寻梅', text: '刚下班就赶来了', time: '12:06' },
  { id: 15, type: 'gift', user: '长风万里', text: '送出了B坷垃', time: '12:06' },
  { id: 16, type: 'normal', user: '云深不知处', text: '主播声音好好听', time: '12:07' },
  { id: 17, type: 'welcome', user: '梦里花落', text: '进入直播间', time: '12:07' },
  { id: 18, type: 'normal', user: '浅唱低吟', text: '关注了关注了', time: '12:08' },
  { id: 19, type: 'gift', user: '繁华落尽', text: '送出了小电视', time: '12:08' },
  { id: 20, type: 'normal', user: '北城以北', text: '第一次来，主播好', time: '12:09' },
  { id: 21, type: 'welcome', user: '南巷清风', text: '进入直播间', time: '12:09' },
  { id: 22, type: 'normal', user: '东隅已逝', text: '弹幕走一波', time: '12:10' },
  { id: 23, type: 'gift', user: '桑榆非晚', text: '送出了B坷垃', time: '12:10' },
  { id: 24, type: 'normal', user: '青衫故人', text: '主播唱首歌吧', time: '12:11' },
  { id: 25, type: 'welcome', user: '白衣渡江', text: '进入直播间', time: '12:11' },
]

const messages = ref<ChatMessage[]>([...mockMessages])

function formatViewerCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

function toggleFollow() {
  isFollowed.value = !isFollowed.value
  showToast(isFollowed.value ? '已关注主播' : '已取消关注')
}

function toggleEmoji() {
  showEmoji.value = !showEmoji.value
  if (showEmoji.value) {
    showToast('表情面板（演示）')
  }
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  messages.value.push({
    id: Date.now(),
    type: 'normal',
    user: '我',
    text,
    time,
  })
  inputText.value = ''
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    const el = messagesRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})

watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
.live-stream-page {
  min-height: 100vh;
  background: #0f0f0f;
  display: flex;
  flex-direction: column;
}

/* Override NavBar for dark theme */
.live-stream-page :deep(.van-nav-bar) {
  background: #1a1a1a;
}
.live-stream-page :deep(.van-nav-bar__title) {
  color: #ffffff;
}
.live-stream-page :deep(.van-nav-bar__arrow) {
  color: #ffffff;
}

/* Player area */
.player-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.live-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--error, #FF4D4F);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 2;
  letter-spacing: 1px;
}

.play-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.play-overlay:hover {
  transform: scale(1.1);
}

.play-icon {
  font-size: 56px;
  color: rgba(255, 255, 255, 0.85);
}

/* Streamer info bar */
.streamer-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #1a1a1a;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--pink-primary, #FB7299);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.viewers {
  font-size: 12px;
  color: var(--text-secondary, #9CA3AF);
  display: flex;
  align-items: center;
  gap: 4px;
}

.viewer-icon {
  font-size: 12px;
}

.follow-btn {
  flex-shrink: 0;
}

.follow-btn.followed {
  background: transparent;
  border-color: var(--text-secondary, #9CA3AF);
  color: var(--text-secondary, #9CA3AF);
}

/* Chat section */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #1a1a1a;
  margin: 1px 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #2a2a2a;
}

.chat-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.chat-count {
  font-size: 12px;
  color: var(--text-secondary, #9CA3AF);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.chat-message {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  animation: message-in 0.2s ease;
}

@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.normal {
  color: #d1d5db;
}

.chat-message.gift {
  background: rgba(251, 114, 153, 0.1);
  color: var(--pink-primary, #FB7299);
}

.chat-message.welcome {
  color: var(--success, #52C41A);
}

.msg-time {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.gift-badge,
.welcome-badge {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.gift-badge {
  background: var(--pink-primary, #FB7299);
  color: #ffffff;
}

.welcome-badge {
  background: rgba(82, 196, 26, 0.2);
  color: var(--success, #52C41A);
}

.msg-user {
  font-weight: 600;
  color: #e5e7eb;
  white-space: nowrap;
  flex-shrink: 0;
}

.msg-text {
  color: #d1d5db;
  word-break: break-all;
}

.chat-message.gift .msg-text {
  color: var(--pink-primary, #FB7299);
}

.chat-message.welcome .msg-text {
  color: var(--success, #52C41A);
}

/* Input bar */
.input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
}

.chat-input {
  flex: 1;
  background: #2a2a2a;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 14px;
  color: #ffffff;
}

.chat-input :deep(.van-field__body) {
  background: transparent;
}

.chat-input :deep(input) {
  color: #ffffff;
}

.chat-input :deep(input::placeholder) {
  color: #666;
}

.emoji-btn {
  flex-shrink: 0;
  background: transparent !important;
  border: none !important;
  color: var(--text-secondary, #9CA3AF) !important;
  font-size: 20px;
  padding: 4px;
}

.send-btn {
  flex-shrink: 0;
}
</style>
