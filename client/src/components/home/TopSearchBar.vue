<template>
  <van-sticky>
    <div class="top-search-bar">
      <van-icon name="play-circle-o" size="28" color="#FB7299" class="logo-icon" />
      <van-search v-model="keyword" shape="round" placeholder="搜索你感兴趣的内容" @focus="$router.push('/search')" readonly />
      <van-icon name="contact-o" size="24" color="#1A1A1A" @click="$router.push('/profile')" />
    </div>
  </van-sticky>
</template>
<script setup lang="ts">import { ref } from 'vue'; const keyword = ref('')</script>
<style scoped>
.top-search-bar { display:flex; align-items:center; gap:8px; padding:8px 16px; background:var(--bg-white); }
.top-search-bar :deep(.van-search) { flex:1; padding:0; }
.top-search-bar :deep(.van-search__content) { background:var(--bg-gray); }
</style>
