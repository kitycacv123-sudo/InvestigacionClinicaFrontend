import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = Number(process.env.PORT || 3000)
const BACKEND_URL =
  (process.env.BACKEND_URL || 'https://investigacionclinica-production.up.railway.app').replace(/\/$/, '')

app.get('/config.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(`window.__BACKEND_URL__ = ${JSON.stringify(BACKEND_URL)};`)
})

const distDir = path.join(__dirname, 'dist')
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  // eslint-disable-next-line no-console
  console.warn(
    '[startup] dist/index.html no existe. Asegúrate de ejecutar `npm run build` (en Railway esto lo hace postinstall).'
  )
}
app.use(express.static(distDir, { index: false }))

// Express v5 (path-to-regexp v6) doesn't accept '*' as a path pattern.
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Frontend running on port ${PORT}`)
})

