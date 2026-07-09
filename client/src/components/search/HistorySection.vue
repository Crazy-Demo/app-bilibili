<template>
  <div class="history-section" v-if="history.length">
    <div class="header">
      <h3>搜索历史</h3>
      <van-icon name="delete-o" @click="$emit('clear')" />
    </div>
    <div class="tags">
      <van-tag v-for="h in history" :key="h" plain type="default" size="medium" @click="$emit('search', h)">{{ h }}</van-tag>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ history: string[] }>()
defineEmits(['clear', 'search'])
</script>
<style scoped>
.history-section { padding:0 16px 16px; }
.header { display:flex; justify-content:space-between; align-items:center; padding:12px 0; }
.header h3 { font-size:15px; font-weight:600; }
.tags { display:flex; flex-wrap:wrap; gap:8px; }
</style>
