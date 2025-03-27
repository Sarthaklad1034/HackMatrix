import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, authorize, updateUserProfile);

export default router;