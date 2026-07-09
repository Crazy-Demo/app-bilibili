<template>
  <div class="network-error">
    <van-empty :description="message" image="network" />
    <van-button type="primary" size="small" @click="$emit('retry')">重试</van-button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>
<style scoped>.network-error { text-align: center; padding: 48px 24px; }</style>
