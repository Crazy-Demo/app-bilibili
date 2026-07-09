import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loggerMiddleware } from './middleware/logger'
import { rateLimiter } from './middleware/rateLimiter'
import { authMiddleware } from './middleware/auth'
import authRoutes from './routes/auth'
import videoRoutes from './routes/video'
import userRoutes from './routes/user'
import searchRoutes from './routes/search'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(loggerMiddleware)
app.use('/api', rateLimiter)
app.use('/api', authMiddleware)

app.use('/api/auth', authRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/user', userRoutes)
app.use('/api/search', searchRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

export default app
