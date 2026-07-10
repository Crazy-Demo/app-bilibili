<template>
  <AppLayout>
    <div class="mall-page">
      <van-nav-bar title="会员购" fixed placeholder />

      <van-swipe :autoplay="3000" indicator-color="#FB7299" class="banner">
        <van-swipe-item v-for="(b, i) in banners" :key="i">
          <div class="banner-item" :style="{ background: b.color }">
            <span class="banner-text">{{ b.title }}</span>
            <span class="banner-sub">{{ b.sub }}</span>
          </div>
        </van-swipe-item>
      </van-swipe>

      <div class="category-row">
        <div v-for="c in categories" :key="c.name" class="cat-item">
          <div class="cat-icon" :style="{ background: c.color }">
            <component :is="c.icon" :size="24" color="#FFFFFF" />
          </div>
          <span>{{ c.name }}</span>
        </div>
      </div>

      <h3 class="section-title">热门商品</h3>
      <div class="product-grid">
        <div v-for="p in products" :key="p.id" class="product-card">
          <img :src="p.image" loading="lazy" />
          <div class="p-info">
            <div class="p-name">{{ p.name }}</div>
            <div class="p-price">¥{{ p.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue'
import { Package, Gift, Ticket, Smile } from 'lucide-vue-next'

interface Banner {
  title: string
  sub: string
  color: string
}

interface Category {
  name: string
  icon: object
  color: string
}

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const banners: Banner[] = [
  { title: '夏日狂欢', sub: '限时优惠低至5折', color: 'linear-gradient(135deg, #FB7299, #FF9F43)' },
  { title: '新品首发', sub: '手办周边抢先预约', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { title: '会员日', sub: '积分翻倍 好物兑换', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { title: '潮玩集市', sub: '潮流单品限时抢购', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
]

const categories: Category[] = [
  { name: '手办', icon: Package, color: '#FB7299' },
  { name: '周边', icon: Gift, color: '#FF9F43' },
  { name: '演出', icon: Ticket, color: '#667eea' },
  { name: '潮玩', icon: Smile, color: '#43e97b' },
]

const products: Product[] = [
  { id: 1, name: '限定手办·夏日Ver.', price: 299, image: 'https://picsum.photos/seed/mall1/300/300' },
  { id: 2, name: 'B站定制卫衣', price: 159, image: 'https://picsum.photos/seed/mall2/300/300' },
  { id: 3, name: '萌系抱枕套装', price: 89, image: 'https://picsum.photos/seed/mall3/300/300' },
  { id: 4, name: '联名耳机', price: 399, image: 'https://picsum.photos/seed/mall4/300/300' },
  { id: 5, name: '动漫主题拼图', price: 69, image: 'https://picsum.photos/seed/mall5/300/300' },
  { id: 6, name: '限量徽章盲盒', price: 25, image: 'https://picsum.photos/seed/mall6/300/300' },
  { id: 7, name: 'Bilibili公仔', price: 128, image: 'https://picsum.photos/seed/mall7/300/300' },
  { id: 8, name: '漫展限定T恤', price: 139, image: 'https://picsum.photos/seed/mall8/300/300' },
]
</script>

<style scoped>
.mall-page {
  padding-bottom: 24px;
}

/* Banner */
.banner {
  margin: 8px 12px;
  border-radius: 10px;
  overflow: hidden;
}

.banner-item {
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.banner-text {
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
}

.banner-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

/* Category row */
.category-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 16px 12px;
}

.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.cat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-item span {
  font-size: 12px;
  color: var(--van-text-color);
}

/* Section title */
.section-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 16px;
  margin: 4px 0 12px;
  color: var(--van-text-color);
}

/* Product grid: 2 columns */
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 12px;
}

.product-card {
  background: var(--van-background-2, #fff);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.p-info {
  padding: 10px;
}

.p-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--van-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.p-price {
  font-size: 15px;
  font-weight: 700;
  color: #FB7299;
}
</style>
