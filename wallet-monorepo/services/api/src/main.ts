import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: false }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'wallet-api', time: new Date().toISOString() })
})

app.get('/', (_req, res) => {
  res.type('text/plain').send('wallet-api running')
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`wallet-api listening on http://localhost:${port}`)
})
