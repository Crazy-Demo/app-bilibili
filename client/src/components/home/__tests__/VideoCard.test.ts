import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VideoCard from '../VideoCard.vue'

const mockVideo = {
  bvid: 'BV1xx411c7m7',
  title: '测试视频标题',
  cover: 'https://example.com/cover.jpg',
  duration: '12:34',
  playCount: '1.5万播放',
  danmakuCount: '500弹幕',
  author: '测试UP主',
  authorAvatar: 'https://example.com/avatar.jpg',
}

describe('VideoCard', () => {
  it('renders video title', () => {
    const wrapper = mount(VideoCard, {
      props: { video: mockVideo },
      global: { stubs: ['router-link', 'router-view'] },
    })
    expect(wrapper.text()).toContain('测试视频标题')
  })

  it('renders duration', () => {
    const wrapper = mount(VideoCard, {
      props: { video: mockVideo },
      global: { stubs: ['router-link', 'router-view'] },
    })
    expect(wrapper.text()).toContain('12:34')
  })

  it('renders author', () => {
    const wrapper = mount(VideoCard, {
      props: { video: mockVideo },
      global: { stubs: ['router-link', 'router-view'] },
    })
    expect(wrapper.text()).toContain('测试UP主')
  })
})
