<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="$router.back()" fixed placeholder />

    <van-cell-group title="播放设置" inset>
      <van-cell title="自动播放" center>
        <template #right-icon><van-switch v-model="autoPlay" size="24px" active-color="#FB7299" /></template>
      </van-cell>
      <van-cell title="弹幕默认开启" center>
        <template #right-icon><van-switch v-model="danmakuOn" size="24px" active-color="#FB7299" /></template>
      </van-cell>
      <van-cell title="清晰度偏好" :value="quality" is-link @click="onSelect('quality')" />
    </van-cell-group>

    <van-cell-group title="缓存" inset>
      <van-cell title="离线缓存" is-link />
      <van-cell title="清除缓存" :value="cacheSize" is-link @click="onClearCache" />
    </van-cell-group>

    <van-cell-group title="隐私" inset>
      <van-cell title="个性化推荐" center>
        <template #right-icon><van-switch v-model="personalize" size="24px" active-color="#FB7299" /></template>
      </van-cell>
      <van-cell title="黑名单管理" is-link />
    </van-cell-group>

    <van-cell-group title="外观" inset>
      <van-cell title="深色模式" center>
        <template #right-icon><van-switch v-model="darkMode" size="24px" active-color="#FB7299" /></template>
      </van-cell>
      <van-cell title="字体大小" :value="fontSize" is-link />
    </van-cell-group>

    <van-cell-group title="关于" inset>
      <van-cell title="版本号" value="1.0.0" />
      <van-cell title="用户协议" is-link />
      <van-cell title="隐私政策" is-link />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { showToast, showConfirmDialog } from 'vant'

const autoPlay = useStorage('settings-auto-play', false)
const danmakuOn = useStorage('settings-danmaku-on', true)
const personalize = useStorage('settings-personalize', true)
const darkMode = useStorage('settings-dark-mode', false)
const quality = useStorage('settings-quality', '自动')
const fontSize = useStorage('settings-font-size', '标准')

const cacheSize = computed(() => '0.0 B')

function onSelect(key: string) {
  // Placeholder for future picker dialog
  showToast('功能开发中')
}

async function onClearCache() {
  try {
    await showConfirmDialog({ title: '清除缓存', message: '确定要清除所有缓存数据吗？' })
    // In a real app, clear IndexedDB / localStorage caches here
    showToast('缓存已清除')
  } catch {
    // cancelled — do nothing
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 24px;
}
</style>
