<template>
  <div class="danmaku-control">
    <div class="toggle-area">
      <van-switch :model-value="enabled" size="20" @update:model-value="$emit('toggle')" />
      <span class="label">弹幕</span>
    </div>
    <div class="input-area">
      <van-field
        v-model="dmText"
        placeholder="发个弹幕吧~"
        :border="false"
        input-align="left"
        class="dm-input"
        @keydown.enter="sendDm"
      />
      <button class="dm-send" @click="sendDm">发送</button>
    </div>
    <div class="settings-icon" @click="$emit('settings')">
      <Settings :size="20" stroke-width="1.5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Settings } from 'lucide-vue-next'

const props = defineProps<{ enabled: boolean }>()
const emit = defineEmits<{
  toggle: []
  send: [text: string]
  settings: []
}>()

const dmText = ref('')

function sendDm() {
  if (dmText.value.trim()) {
    emit('send', dmText.value)
    dmText.value = ''
  }
}
</script>

<style scoped>
.danmaku-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-gray);
  border-radius: var(--radius-lg);
  margin: 0 16px 8px;
}
.toggle-area {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.label {
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
}
.input-area {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-white);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.dm-input {
  flex: 1;
  font-size: 13px;
  padding: 6px 12px;
}
.dm-send {
  flex-shrink: 0;
  background: var(--pink-primary);
  color: #fff;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}
.settings-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  -webkit-tap-highlight-color: transparent;
}
</style>
