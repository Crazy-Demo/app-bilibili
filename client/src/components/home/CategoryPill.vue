<template>
  <van-tabs v-model:active="active" sticky offset-top="56" swipeable color="#FB7299">
    <van-tab v-for="tab in tabs" :key="tab" :title="tab" />
  </van-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
const tabs = ['推荐', '直播', '热门', '动画', '音乐', '舞蹈', '追番', '科技', '游戏', '知识', '美食']
</script>
