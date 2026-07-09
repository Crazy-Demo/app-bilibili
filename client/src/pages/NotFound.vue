<template>
  <div class="not-found">
    <van-empty description="页面不存在" image="error" />
    <van-button type="primary" to="/">返回首页</van-button>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.not-found { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; gap:24px; }
</style>
