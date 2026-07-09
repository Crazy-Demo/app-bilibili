<template>
  <div class="social-login">
    <div class="divider"><span class="divider-text">其他方式登录</span></div>
    <div class="social-btns">
      <div class="social-btn wechat" @click="onClick('微信')"><MessageCircle :size="22" color="#FFFFFF" /></div>
      <div class="social-btn qq" @click="onClick('QQ')"><MessageSquare :size="22" color="#FFFFFF" /></div>
      <div class="social-btn weibo" @click="onClick('微博')"><AtSign :size="22" color="#FFFFFF" /></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { showToast } from 'vant'
import { MessageCircle, MessageSquare, AtSign } from 'lucide-vue-next'
function onClick(name: string) { showToast(`${name} 登录功能开发中`) }
</script>
<style scoped>
.social-login { padding:24px 32px; }
.divider { text-align:center; position:relative; margin-bottom:24px; }
.divider-text { font-size:12px; color:var(--text-secondary); background:var(--bg-white); padding:0 12px; position:relative; z-index:1; }
.social-btns { display:flex; justify-content:center; gap:24px; }
.social-btn { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.wechat { background:#07C160; } .qq { background:#12B7F5; } .weibo { background:#E6162D; }
</style>
