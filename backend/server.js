import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import express from 'express'
import routes from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 3001

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json())
app.use('/api', routes)

// Serwowanie plików statycznych zbudowanego frontendu React
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Obsługa routingu SPA po stronie klienta
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`)
})
