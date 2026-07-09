<template>
  <div class="skeleton-card">
    <van-skeleton :row="3" :loading="true"><div class="skeleton-placeholder" /></van-skeleton>
  </div>
</template>
<style scoped>.skeleton-card { padding: 8px; } .skeleton-placeholder { height: 120px; }</style>
