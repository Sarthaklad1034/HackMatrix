import express from 'express';
import {
    getAssignedHackathons,
    getProjectsToJudge,
    getJudgeProfile
} from '../controllers/judgeController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Judge-specific routes
router.get('/profile', protect, restrictTo('judge'), getJudgeProfile);
router.get('/hackathons', protect, restrictTo('judge'), getAssignedHackathons);
router.get('/projects', protect, restrictTo('judge'), getProjectsToJudge);

export default router;