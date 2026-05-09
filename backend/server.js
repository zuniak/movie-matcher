import cors from 'cors'
import express from 'express'
import routes from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`)
})
