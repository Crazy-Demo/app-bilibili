import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore } from '../history'

describe('history store', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('adds search keyword', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    expect(store.searchHistory).toContain('test')
  })

  it('deduplicates keywords', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    store.addSearch('test')
    expect(store.searchHistory.filter(k => k === 'test').length).toBe(1)
  })

  it('limits history to 20', () => {
    const store = useHistoryStore()
    for (let i = 0; i < 25; i++) store.addSearch(`kw${i}`)
    expect(store.searchHistory.length).toBeLessThanOrEqual(20)
  })

  it('clears history', () => {
    const store = useHistoryStore()
    store.addSearch('test')
    store.clearSearch()
    expect(store.searchHistory.length).toBe(0)
  })
})
