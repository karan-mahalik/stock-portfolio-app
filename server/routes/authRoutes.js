import express from 'express'
import { deleteAccount, login, signup, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const routes = express.Router()

routes.post('/signup', signup)
routes.post('/login', login)
routes.put('/update', protect, updateProfile)
routes.delete('/delete', protect, deleteAccount)

export default routes
