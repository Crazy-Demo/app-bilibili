<template>
  <ErrorBoundary>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'slide-right'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </ErrorBoundary>
</template>
<script setup lang="ts">
import ErrorBoundary from './components/common/ErrorBoundary.vue'
</script>
