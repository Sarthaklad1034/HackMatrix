import express from 'express';
import {
    createProject,
    getProjectById,
    getProjectsByHackathon,
    updateProject,
    submitProjectScore,
    finalizeProjectRankings,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Project creation and management routes
router.post('/', protect, createProject);
router.get('/hackathon/:hackathonId', protect, getProjectsByHackathon);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);

// Project submission route
router.post('/:id/submit', protect, submitProjectScore);

// Judging routes
router.post('/:id/judge', protect, authorize('judge'), finalizeProjectRankings);

export default router;