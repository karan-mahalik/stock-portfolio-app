import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import routes from './routes/authRoutes.js'
import holdingRoutes from './routes/holdingRoutes.js'
import watchlistRoutes from './routes/watchlistRoutes.js'
import alertRoutes from "./routes/alertRoutes.js"
import stockRoutes from "./routes/stockRoutes.js"

dotenv.config()
import "./cronJobs/alertCheck.js"


const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use('/api/auth', routes)
app.use('/api/holdings', holdingRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/stocks', stockRoutes)

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Backend is running...')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})