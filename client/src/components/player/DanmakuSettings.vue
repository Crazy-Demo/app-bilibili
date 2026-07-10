<template>
  <van-popup
    v-model:show="visible"
    position="bottom"
    round
    :style="{ padding: '20px 16px', maxHeight: '80vh' }"
    @close="$emit('close')"
  >
    <h3 class="settings-title">弹幕设置</h3>

    <!-- Opacity -->
    <div class="setting-item">
      <span class="setting-label">不透明度</span>
      <div class="slider-row">
        <van-slider
          v-model="localOpacity"
          :min="0"
          :max="100"
          :step="1"
          bar-color="var(--pink-primary)"
          active-color="var(--pink-primary)"
          @change="onOpacityChange"
        />
        <span class="slider-value">{{ localOpacity }}%</span>
      </div>
    </div>

    <!-- Font size -->
    <div class="setting-item">
      <span class="setting-label">字体大小</span>
      <van-radio-group v-model="localFontSize" direction="horizontal" class="radio-group">
        <van-radio name="small" shape="square" class="radio-item">小</van-radio>
        <van-radio name="medium" shape="square" class="radio-item">中</van-radio>
        <van-radio name="large" shape="square" class="radio-item">大</van-radio>
      </van-radio-group>
    </div>

    <!-- Speed -->
    <div class="setting-item">
      <span class="setting-label">弹幕速度</span>
      <van-radio-group v-model="localSpeed" direction="horizontal" class="radio-group">
        <van-radio name="slow" shape="square" class="radio-item">慢速</van-radio>
        <van-radio name="normal" shape="square" class="radio-item">正常</van-radio>
        <van-radio name="fast" shape="square" class="radio-item">快速</van-radio>
      </van-radio-group>
    </div>

    <!-- Color picker -->
    <div class="setting-item">
      <span class="setting-label">弹幕颜色</span>
      <div class="color-picker">
        <div
          v-for="color in presetColors"
          :key="color.value"
          class="color-circle"
          :class="{ active: localColor === color.value }"
          :style="{ backgroundColor: color.value }"
          @click="localColor = color.value"
        />
      </div>
    </div>

    <!-- Shield keywords -->
    <div class="setting-item">
      <span class="setting-label">屏蔽关键词</span>
      <van-field
        v-model="shieldText"
        placeholder="多个关键词用逗号分隔"
        :border="true"
        class="shield-input"
      />
    </div>

    <!-- Action buttons -->
    <div class="action-row">
      <van-button round block class="btn-reset" @click="handleReset">重置</van-button>
      <van-button round block type="primary" class="btn-save" @click="handleSave">保存</van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'

const props = defineProps<{
  show: boolean
  opacity: number
  fontSize: string
  speed: string
  color: string
  shieldKeywords: string
}>()

const emit = defineEmits<{
  close: []
  update: [settings: { opacity: number; fontSize: string; speed: string; color: string; shieldKeywords: string }]
}>()

const presetColors = [
  { value: '#FFFFFF', label: '白色' },
  { value: '#FF4D4F', label: '红色' },
  { value: '#00A1D6', label: '蓝色' },
  { value: '#52C41A', label: '绿色' },
  { value: '#FAAD14', label: '黄色' },
  { value: '#FB7299', label: '粉色' },
]

const visible = ref(props.show)
const localOpacity = ref(props.opacity * 100)
const localFontSize = ref(props.fontSize)
const localSpeed = ref(props.speed)
const localColor = ref(props.color)
const shieldText = ref(props.shieldKeywords)

watch(() => props.show, (val) => {
  visible.value = val
  if (val) {
    // Reset local state from props
    localOpacity.value = props.opacity * 100
    localFontSize.value = props.fontSize
    localSpeed.value = props.speed
    localColor.value = props.color
    shieldText.value = props.shieldKeywords
  }
})

watch(() => visible.value, (val) => {
  if (!val) emit('close')
})

function onOpacityChange(val: number) {
  localOpacity.value = val
}

function handleSave() {
  emit('update', {
    opacity: localOpacity.value / 100,
    fontSize: localFontSize.value,
    speed: localSpeed.value,
    color: localColor.value,
    shieldKeywords: shieldText.value,
  })
  showToast('设置已保存')
  visible.value = false
}

function handleReset() {
  localOpacity.value = 70
  localFontSize.value = 'medium'
  localSpeed.value = 'normal'
  localColor.value = '#FFFFFF'
  shieldText.value = ''
  showToast('已重置')
}
</script>

<style scoped>
.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 20px;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-label {
  display: block;
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 500;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-row .van-slider {
  flex: 1;
}

.slider-value {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 36px;
  text-align: right;
}

.radio-group {
  display: flex;
  gap: 8px;
}

.radio-item {
  flex: 1;
}

.color-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.color-circle.active {
  border-color: var(--pink-primary);
  box-shadow: 0 0 0 2px var(--pink-primary), 0 1px 3px rgba(0, 0, 0, 0.15);
}

.shield-input {
  padding: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-reset {
  flex: 1;
  background: var(--bg-gray) !important;
  border: 1px solid var(--border-subtle) !important;
  color: var(--text-primary) !important;
}

.btn-save {
  flex: 1;
}
</style>
