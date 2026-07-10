<template>
  <AppLayout>
    <div class="notification-page">
      <van-nav-bar title="消息" fixed placeholder />
      <van-tabs v-model:active="activeTab" sticky offset-top="46" color="#FB7299">
        <van-tab title="赞" />
        <van-tab title="评论" />
        <van-tab title="关注" />
        <van-tab title="系统" />
      </van-tabs>

      <div class="notif-list">
        <div v-for="item in filteredNotifications" :key="item.id" class="notif-item" @click="onItemClick(item)">
          <img :src="item.avatar" class="avatar" />
          <div class="notif-body">
            <div class="notif-header">
              <span class="username">{{ item.username }}</span>
              <span class="type-badge">{{ item.typeLabel }}</span>
              <span class="time">{{ formatTime(item.time) }}</span>
            </div>
            <div class="notif-content">{{ item.content }}</div>
            <div v-if="item.reply" class="notif-reply">「{{ item.reply }}」</div>
          </div>
          <div v-if="item.unread" class="unread-dot" />
        </div>
        <EmptyState v-if="!filteredNotifications.length" message="暂无消息" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import AppLayout from '../components/layout/AppLayout.vue'
import EmptyState from '../components/common/EmptyState.vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface NotificationItem {
  id: number
  type: 'like' | 'comment' | 'follow' | 'system'
  typeLabel: string
  username: string
  avatar: string
  content: string
  reply?: string
  time: number
  unread: boolean
}

const activeTab = ref(0)

const notifications = ref<NotificationItem[]>([
  { id: 1, type: 'like', typeLabel: '赞', username: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming', content: '赞了你的视频「Vue3 入门教程」', time: Date.now() - 1000 * 60 * 5, unread: true },
  { id: 2, type: 'comment', typeLabel: '评论', username: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', content: '评论了你的视频「Vue3 入门教程」', reply: '讲得很清楚，期待后续！', time: Date.now() - 1000 * 60 * 30, unread: true },
  { id: 3, type: 'follow', typeLabel: '关注', username: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', content: '关注了你', time: Date.now() - 1000 * 60 * 60, unread: true },
  { id: 4, type: 'system', typeLabel: '系统', username: 'B站小助手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bili', content: '你的视频「Vue3 入门教程」已通过审核', time: Date.now() - 1000 * 60 * 120, unread: true },
  { id: 5, type: 'like', typeLabel: '赞', username: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', content: '赞了你的视频「TypeScript 进阶」', time: Date.now() - 1000 * 60 * 180, unread: false },
  { id: 6, type: 'comment', typeLabel: '评论', username: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', content: '评论了你的动态「周末直播预告」', reply: '几点开始？', time: Date.now() - 1000 * 60 * 240, unread: false },
  { id: 7, type: 'follow', typeLabel: '关注', username: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaohong', content: '关注了你', time: Date.now() - 1000 * 60 * 360, unread: false },
  { id: 8, type: 'system', typeLabel: '系统', username: 'B站小助手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bili', content: '系统维护通知：今晚 2:00-4:00 进行服务器升级', time: Date.now() - 1000 * 60 * 480, unread: false },
  { id: 9, type: 'like', typeLabel: '赞', username: '程序猿小陈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen', content: '赞了你的视频「Pinia 状态管理」', time: Date.now() - 1000 * 60 * 600, unread: false },
  { id: 10, type: 'comment', typeLabel: '评论', username: '前端小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifront', content: '评论了你的专栏「性能优化指南」', reply: '第三点特别实用！', time: Date.now() - 1000 * 60 * 900, unread: false },
  { id: 11, type: 'like', typeLabel: '赞', username: '设计师范', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fanshi', content: '赞了你的视频「CSS 动画技巧」', time: Date.now() - 1000 * 60 * 1200, unread: false },
  { id: 12, type: 'follow', typeLabel: '关注', username: '后端老王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laowang', content: '关注了你', time: Date.now() - 1000 * 60 * 1500, unread: false },
  { id: 13, type: 'system', typeLabel: '系统', username: 'B站小助手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bili', content: '恭喜！你获得「优质创作者」荣誉称号', time: Date.now() - 1000 * 60 * 1800, unread: false },
  { id: 14, type: 'like', typeLabel: '赞', username: '全栈开发', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstack', content: '赞了你的视频「Docker 部署实战」', time: Date.now() - 1000 * 60 * 2400, unread: false },
  { id: 15, type: 'comment', typeLabel: '评论', username: '测试达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tester', content: '评论了你的视频「单元测试入门」', reply: '覆盖率多少算合格？', time: Date.now() - 1000 * 60 * 3000, unread: false },
])

const typeMap = ['like', 'comment', 'follow', 'system'] as const

const filteredNotifications = computed(() => {
  const type = typeMap[activeTab.value]
  return notifications.value.filter((item) => item.type === type)
})

function formatTime(timestamp: number): string {
  return dayjs(timestamp).fromNow()
}

function onItemClick(item: NotificationItem) {
  item.unread = false
  showToast(`查看${item.typeLabel}详情`)
}
</script>

<style scoped>
.notification-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.notif-list {
  padding: 8px 12px;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 12px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.notif-item:active {
  background: #f9f9f9;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  background: #eee;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.type-badge {
  font-size: 11px;
  color: #FB7299;
  background: rgba(251, 114, 153, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.time {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.notif-content {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.notif-reply {
  margin-top: 6px;
  padding: 8px 10px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 13px;
  color: #888;
  line-height: 1.4;
}

.unread-dot {
  position: absolute;
  top: 14px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FB7299;
}
</style>
