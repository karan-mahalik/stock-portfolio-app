import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addAlert, deleteAlert, getAlerts } from '../controllers/alertController.js'

const router = express.Router()

router.post("/add", protect, addAlert)
router.get("/", protect, getAlerts)
router.delete("/:id", protect, deleteAlert)

export default router