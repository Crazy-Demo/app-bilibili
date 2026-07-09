<template>
  <div class="hot-section">
    <h3>热门搜索</h3>
    <div class="hot-list">
      <div v-for="(kw, i) in hotWords" :key="kw" class="hot-item" @click="$emit('search', kw)">
        <span class="rank" :class="{ top3: i < 3 }">{{ i + 1 }}</span>
        <span class="kw">{{ kw }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ hotWords: string[] }>()
defineEmits(['search'])
</script>
<style scoped>
.hot-section { padding:0 16px; }
.hot-section h3 { font-size:15px; font-weight:600; padding:12px 0; }
.hot-item { display:flex; align-items:center; gap:12px; padding:10px 0; cursor:pointer; }
.rank { width:20px; text-align:center; font-size:14px; font-weight:600; color:var(--text-secondary); }
.top3 { color:#FF6633; }
.kw { font-size:14px; }
</style>
