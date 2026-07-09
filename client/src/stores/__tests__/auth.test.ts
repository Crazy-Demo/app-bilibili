import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('starts not logged in', () => {
    const store = useAuthStore()
    expect(store.isLogin).toBe(false)
    expect(store.user).toBeNull()
  })
})
