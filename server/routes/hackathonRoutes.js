import express from 'express';
import {
    createHackathon,
    getHackathons,
    getHackathonById,
    updateHackathon,
    deleteHackathon,
    registerTeamForHackathon,
    addJudgeToHackathon
} from '../controllers/hackathonController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getHackathons);
router.get('/:id', getHackathonById);

// Private routes for hackathon management
router.post('/', protect, authorize('organizer', 'admin'), createHackathon);
router.put('/:id', protect, authorize('organizer', 'admin'), updateHackathon);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteHackathon);

// Team registration route
router.post('/:id/register-team', protect, registerTeamForHackathon);

// Add judge route
router.post('/:id/add-judge', protect, authorize('organizer', 'admin'), addJudgeToHackathon);

export default router;