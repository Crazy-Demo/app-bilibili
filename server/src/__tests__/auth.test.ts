import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('POST /api/auth/login', () => {
  it('returns 400 for empty username', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '', password: '123456' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for short password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: '123' })
    expect(res.status).toBe(400)
  })

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'wrongpass' })
    expect(res.status).toBe(401)
  })

  it('returns 200 and sets cookie for valid login', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'test123456' })
    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.body.data.user.username).toBe('testuser')
  })
})

describe('GET /api/video/feed', () => {
  it('returns video list', async () => {
    const res = await request(app).get('/api/video/feed')
    expect(res.status).toBe(200)
    expect(res.body.data.videos).toHaveLength(10)
  })

  it('accepts page and pageSize params', async () => {
    const res = await request(app).get('/api/video/feed?page=2&pageSize=5')
    expect(res.status).toBe(200)
    expect(res.body.data.videos).toHaveLength(5)
  })
})
