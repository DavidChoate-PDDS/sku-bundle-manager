import express from 'express'
import cors from 'cors'
import bundleRoutes from './routes/bundles.js'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
mkdirSync(path.join(__dirname, '../data'), { recursive: true })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/bundles', bundleRoutes)

const PORT = 3001
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
