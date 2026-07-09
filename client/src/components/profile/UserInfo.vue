<template>
  <div class="user-info">
    <img :src="user.face" class="avatar" />
    <div class="info">
      <div class="name-row"><span class="name">{{ user.name }}</span><span class="level">Lv.{{ user.level }}</span></div>
      <div class="stats">
        <span>{{ formatCount(user.following) }} 关注</span>
        <span>{{ formatCount(user.followers) }} 粉丝</span>
        <span>{{ formatCount(user.likes) }} 获赞</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserProfile } from '../../../../shared/types/user'
defineProps<{ user: UserProfile }>()
function formatCount(n: number): string { return n > 10000 ? (n / 10000).toFixed(1) + '万' : String(n) }
</script>
<style scoped>
.user-info { display:flex; align-items:center; gap:16px; padding:24px 16px; background:var(--pink-primary); }
.avatar { width:64px; height:64px; border-radius:50%; border:2px solid rgba(255,255,255,0.5); }
.info { color:#FFFFFF; }
.name { font-size:18px; font-weight:600; }
.level { font-size:11px; background:rgba(255,255,255,0.3); padding:1px 6px; border-radius:4px; margin-left:8px; }
.stats { display:flex; gap:16px; font-size:12px; margin-top:6px; opacity:0.9; }
</style>
