<template>
  <div class="creator-info-bar">
    <img class="avatar" :src="avatar" :alt="name" />
    <div class="info">
      <span class="name">{{ name }}</span>
      <span class="subs">{{ subs }}</span>
    </div>
    <van-button
      round
      type="primary"
      size="small"
      plain
      class="follow-btn"
      @click="$emit('follow')"
    >
      + 关注
    </van-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
  name: string
  subs: string
}>()

defineEmits<{
  follow: []
}>()
</script>

<style scoped>
.creator-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.subs {
  font-size: 12px;
  color: var(--text-secondary);
}
.follow-btn {
  flex-shrink: 0;
}
</style>
