<template>
  <van-tabbar v-model="active" :fixed="false" active-color="#FB7299" inactive-color="#9CA3AF">
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/search" icon="compass">动态</van-tabbar-item>
    <van-tabbar-item @click="showPublish = true">
      <template #icon>
        <div class="publish-btn"><Plus :size="26" color="#FFFFFF" /></div>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/channel" icon="shopping-bag">会员购</van-tabbar-item>
    <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>

  <van-share-sheet v-model:show="showPublish" title="发布" :options="publishOptions" @select="onPublishSelect" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { Plus } from 'lucide-vue-next'

const active = ref(0)
const showPublish = ref(false)
const publishOptions = [
  { name: '发视频', icon: 'video-o' },
  { name: '发动态', icon: 'photo-o' },
  { name: '开直播', icon: 'play-circle-o' },
]
function onPublishSelect(option: { name: string }) {
  showPublish.value = false
  showToast(`${option.name} 功能开发中`)
}
</script>

<style scoped>
.publish-btn {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--pink-primary);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 -4px 8px rgba(251, 114, 153, 0.25);
  margin-top: -14px;
}
</style>
