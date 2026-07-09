<template>
  <slot v-if="!hasError" />
  <NetworkError v-else :message="errorMessage" @retry="reset" />
</template>
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import NetworkError from './NetworkError.vue'
const hasError = ref(false)
const errorMessage = ref('')
onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = (err as Error).message || '发生未知错误'
  return false
})
function reset() { hasError.value = false; errorMessage.value = '' }
</script>
