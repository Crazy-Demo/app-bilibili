<template>
  <AppLayout>
    <div class="upload-page">
      <div class="page-header">
        <h2>上传视频</h2>
      </div>

      <!-- Upload Zone -->
      <div
        class="upload-zone"
        :class="{ 'upload-zone--dragover': isDragging, 'upload-zone--has-file': selectedFile }"
        @click="triggerFileInput"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="video/*"
          class="file-input-hidden"
          @change="onFileChange"
        />
        <template v-if="!selectedFile">
          <van-icon name="cloud-upload-o" class="upload-icon" />
          <p class="upload-text">点击或拖拽上传视频</p>
          <p class="upload-hint">支持 MP4, MOV, AVI 等格式</p>
        </template>
        <template v-else>
          <van-icon name="video-o" class="file-icon" />
          <div class="file-info">
            <p class="file-name">{{ selectedFile.name }}</p>
            <p class="file-size">{{ formatSize(selectedFile.size) }}</p>
          </div>
          <van-button size="small" round plain type="default" class="rechoose-btn" @click.stop="resetFile">
            重新选择
          </van-button>
        </template>
      </div>

      <!-- Form -->
      <van-form class="upload-form" @submit="onPublish">
        <van-field
          v-model="form.title"
          name="title"
          label="标题"
          placeholder="请输入视频标题"
          :rules="[{ required: true, message: '请输入视频标题' }]"
          maxlength="80"
          show-word-limit
        />

        <van-field
          v-model="form.description"
          name="description"
          label="简介"
          type="textarea"
          placeholder="介绍一下你的视频吧"
          :autosize="{ minHeight: 80, maxHeight: 200 }"
          maxlength="1000"
          show-word-limit
          rows="3"
        />

        <!-- Tags -->
        <div class="van-cell van-field">
          <div class="van-cell__title van-field__label"><span>标签</span></div>
          <div class="van-cell__value">
            <div class="tags-wrapper">
              <van-tag
                v-for="(tag, index) in form.tags"
                :key="index"
                closeable
                size="medium"
                type="primary"
                class="tag-item"
                @close="removeTag(index)"
              >
                {{ tag }}
              </van-tag>
              <input
                v-model="tagInput"
                class="tag-input"
                placeholder="输入标签后按回车添加"
                @keydown.enter.prevent="addTag"
                @keydown.backspace="onTagBackspace"
              />
            </div>
          </div>
        </div>

        <!-- Category Picker -->
        <van-field
          v-model="form.categoryLabel"
          is-link
          readonly
          name="category"
          label="分类"
          placeholder="请选择分类"
          :rules="[{ required: true, message: '请选择分类' }]"
          @click="showCategoryPicker = true"
        />

        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :disabled="!selectedFile"
          >
            发布视频
          </van-button>
        </div>
      </van-form>

      <!-- Category Picker Popup -->
      <van-popup v-model:show="showCategoryPicker" position="bottom" round>
        <van-picker
          :columns="categories"
          @confirm="onCategoryConfirm"
          @cancel="showCategoryPicker = false"
          title="选择分类"
        />
      </van-popup>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import AppLayout from '../components/layout/AppLayout.vue'

const router = useRouter()

// --- File Upload ---
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    selectedFile.value = e.dataTransfer.files[0]
  }
}

function resetFile() {
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

// --- Form ---
const form = reactive({
  title: '',
  description: '',
  tags: [] as string[],
  category: '',
  categoryLabel: '',
})

// --- Tags ---
const tagInput = ref('')

function addTag() {
  const trimmed = tagInput.value.trim()
  if (trimmed && !form.tags.includes(trimmed) && form.tags.length < 10) {
    form.tags.push(trimmed)
  }
  tagInput.value = ''
}

function removeTag(index: number) {
  form.tags.splice(index, 1)
}

function onTagBackspace() {
  if (tagInput.value === '' && form.tags.length > 0) {
    form.tags.pop()
  }
}

// --- Category Picker ---
const showCategoryPicker = ref(false)
const categories = [
  { text: '游戏', value: 'game' },
  { text: '知识', value: 'knowledge' },
  { text: '音乐', value: 'music' },
  { text: '生活', value: 'lifestyle' },
  { text: '科技', value: 'tech' },
  { text: '娱乐', value: 'entertainment' },
  { text: '动画', value: 'animation' },
  { text: '影视', value: 'film' },
  { text: '体育', value: 'sports' },
  { text: '舞蹈', value: 'dance' },
  { text: '鬼畜', value: 'kichiku' },
  { text: '时尚', value: 'fashion' },
]

function onCategoryConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  const option = selectedOptions[0]
  if (option) {
    form.category = option.value
    form.categoryLabel = option.text
  }
  showCategoryPicker.value = false
}

// --- Publish ---
function onPublish() {
  if (!selectedFile.value) {
    showToast('请先选择要上传的视频文件')
    return
  }
  // Mock publish
  showToast('发布成功')
  router.replace('/')
}
</script>

<style scoped>
.upload-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #333);
}

/* Upload Zone */
.upload-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: var(--van-gray-1, #f7f8fa);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 24px;
  margin-bottom: 16px;
}

.upload-zone:hover {
  border-color: var(--van-primary-color, #1989fa);
  background: rgba(25, 137, 250, 0.04);
}

.upload-zone--dragover {
  border-color: var(--van-primary-color, #1989fa);
  background: rgba(25, 137, 250, 0.08);
  transform: scale(1.01);
}

.upload-zone--has-file {
  flex-direction: row;
  gap: 12px;
  border-style: solid;
  border-color: var(--van-primary-color, #1989fa);
  background: rgba(25, 137, 250, 0.04);
  cursor: default;
  min-height: 80px;
}

.file-input-hidden {
  display: none;
}

.upload-icon {
  font-size: 48px;
  color: var(--van-primary-color, #1989fa);
  margin-bottom: 8px;
}

.upload-text {
  margin: 4px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #333);
}

.upload-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary, #999);
}

.file-icon {
  font-size: 36px;
  color: var(--van-primary-color, #1989fa);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-secondary, #999);
}

.rechoose-btn {
  flex-shrink: 0;
}

/* Tags */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.tag-item {
  flex-shrink: 0;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 4px 0;
  background: transparent;
  color: var(--text-primary, #333);
  line-height: 1.6;
}

.tag-input::placeholder {
  color: var(--text-secondary, #c8c9cc);
}

/* Override van-cell for tags section to be more consistent */
.upload-form :deep(.van-field__label) {
  width: 50px;
  margin-right: 8px;
}

.upload-form :deep(.van-cell) {
  padding-left: 0;
  padding-right: 0;
}

.upload-form {
  margin-top: 8px;
}
</style>
