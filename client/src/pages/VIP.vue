<template>
  <AppLayout>
    <div class="vip-page">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <Crown :size="48" color="#FFFFFF" class="crown-icon" />
        <h1 class="hero-title">bilibili 大会员</h1>
        <p class="hero-subtitle">解锁专属特权</p>
      </div>

      <!-- Privilege Grid -->
      <div class="privilege-section">
        <h2 class="section-title">专属特权</h2>
        <div class="privilege-grid">
          <div
            v-for="item in privileges"
            :key="item.label"
            class="privilege-item"
          >
            <div class="privilege-icon" :style="{ background: item.color }">
              <component :is="item.icon" :size="22" color="#FFFFFF" />
            </div>
            <span class="privilege-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-section">
        <h2 class="section-title">开通方案</h2>
        <div class="pricing-row">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="pricing-card"
            :class="{ 'pricing-card--featured': plan.featured }"
          >
            <div v-if="plan.featured" class="featured-badge">最划算</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="amount">{{ plan.price }}</span>
            </div>
            <div class="plan-subprice">{{ plan.subprice }}</div>
            <van-button
              round
              block
              :type="plan.featured ? 'primary' : 'default'"
              :class="{ 'btn-outline': !plan.featured }"
              @click="handlePurchase(plan)"
            >
              立即开通
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue'
import { showToast } from 'vant'
import {
  Crown,
  Medal,
  Heart,
  Sticker,
  Layout,
  MessageCircle,
  Film,
  BookOpen,
  Gem,
} from 'lucide-vue-next'

interface Privilege {
  label: string
  icon: object
  color: string
}

interface Plan {
  name: string
  price: number
  subprice: string
  featured: boolean
  period: string
}

const privileges: Privilege[] = [
  { label: '专属挂件', icon: Medal, color: '#FB7299' },
  { label: '粉色昵称', icon: Heart, color: '#FF9F43' },
  { label: '评论表情', icon: Sticker, color: '#667eea' },
  { label: '空间头图', icon: Layout, color: '#43e97b' },
  { label: '弹幕特权', icon: MessageCircle, color: '#f093fb' },
  { label: '付费影片', icon: Film, color: '#4facfe' },
  { label: '漫读VIP', icon: BookOpen, color: '#43e97b' },
  { label: '每月B币', icon: Gem, color: '#FF9F43' },
]

const plans: Plan[] = [
  { name: '月度会员', price: 25, subprice: '25元/月', featured: false, period: 'month' },
  { name: '季度会员', price: 68, subprice: '约22.7元/月', featured: false, period: 'quarter' },
  { name: '年度会员', price: 233, subprice: '约19.4元/月', featured: true, period: 'year' },
]

function handlePurchase(plan: Plan): void {
  showToast(`已开通${plan.name}，¥${plan.price}`)
}
</script>

<style scoped>
.vip-page {
  padding-bottom: 32px;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #FB7299 0%, #FF9F43 100%);
  padding: 40px 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.crown-icon {
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.hero-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
}

/* Section Title */
.section-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 16px;
  margin: 20px 0 12px;
  color: var(--van-text-color);
}

/* Privilege Grid */
.privilege-section {
  margin-top: 0;
}

.privilege-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px;
}

.privilege-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: var(--van-background-2, #FFFFFF);
  border-radius: var(--radius-lg, 12px);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.privilege-item:active {
  transform: scale(0.96);
}

.privilege-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privilege-label {
  font-size: 12px;
  color: var(--van-text-color);
  font-weight: 500;
  text-align: center;
}

/* Pricing Section */
.pricing-section {
  margin-top: 4px;
}

.pricing-row {
  display: flex;
  gap: 10px;
  padding: 0 12px;
}

.pricing-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 8px 16px;
  background: var(--van-background-2, #FFFFFF);
  border-radius: var(--radius-lg, 12px);
  border: 1.5px solid var(--border-subtle, #E5E7EB);
  position: relative;
  overflow: visible;
}

.pricing-card--featured {
  border-color: var(--pink-primary, #FB7299);
  background: linear-gradient(180deg, rgba(251, 114, 153, 0.06) 0%, #FFFFFF 40%);
  box-shadow: 0 2px 12px rgba(251, 114, 153, 0.15);
}

.featured-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #FB7299, #FF9F43);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 12px;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(251, 114, 153, 0.3);
}

.plan-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--van-text-color);
  margin-bottom: 2px;
}

.plan-price {
  display: flex;
  align-items: flex-start;
  gap: 0;
  line-height: 1;
}

.currency {
  font-size: 14px;
  font-weight: 600;
  color: var(--pink-primary, #FB7299);
  margin-top: 4px;
}

.amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--pink-primary, #FB7299);
}

.pricing-card--featured .currency,
.pricing-card--featured .amount {
  color: var(--pink-primary, #FB7299);
}

.plan-subprice {
  font-size: 11px;
  color: var(--text-secondary, #9CA3AF);
  margin-bottom: 4px;
}

.pricing-card .van-button {
  height: 32px;
  font-size: 12px;
  border-radius: 16px;
  padding: 0 12px;
}

.btn-outline {
  border: 1px solid var(--pink-primary, #FB7299) !important;
  color: var(--pink-primary, #FB7299) !important;
  background: transparent !important;
}
</style>
