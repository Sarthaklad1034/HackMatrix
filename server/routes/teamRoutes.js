import express from 'express';
import {
    createTeam,
    getTeamById,
    updateTeam,
    inviteTeamMember,
    acceptTeamInvite,
    removeTeamMember
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Team creation and management routes
router.post('/', protect, createTeam);
router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeam);

// Team member invitation routes
router.post('/:id/invite', protect, inviteTeamMember);
router.post('/accept-invite/:inviteToken', protect, acceptTeamInvite);
router.delete('/:teamId/members/:memberId', protect, removeTeamMember);

export default router;