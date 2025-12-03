import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addHolding, deleteHolding, editHolding, getHoldings } from "../controllers/holdingController.js"

const routes = express.Router()

routes.post('/add', protect, addHolding)
routes.get('/', protect, getHoldings)
routes.put('/edit/:id', protect, editHolding)
routes.delete('/delete/:id', protect, deleteHolding)

export default routes