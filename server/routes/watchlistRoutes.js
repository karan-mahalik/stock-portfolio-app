import express from 'express'
import { addToWatchlist, getWatchlist, removeFromwatchlist } from '../controllers/watchlistController.js'
import { protect } from '../middleware/authMiddleware.js'

const routes = express.Router()

routes.post('/add', protect, addToWatchlist)
routes.get('/', protect, getWatchlist)
routes.delete('/:symbol', protect, removeFromwatchlist)

export default routes