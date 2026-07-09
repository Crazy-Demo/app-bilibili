<template>
  <div class="app-layout">
    <main class="app-content"><slot /></main>
    <BottomTabBar v-if="showTabBar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomTabBar from './BottomTabBar.vue'

const route = useRoute()
const showTabBar = computed(() => !['video', 'login'].includes(route.name as string))
</script>

<style scoped>
.app-layout {
  display: flex; flex-direction: column; height: 100vh;
  max-width: 480px; margin: 0 auto; position: relative;
}
.app-content {
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
}
</style>
