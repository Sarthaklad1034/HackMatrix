import asyncHandler from 'express-async-handler';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = asyncHandler(async(req, res) => {
    const { name, hackathonId, description, skills } = req.body;

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if team name is unique
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
        return res.status(400).json({ message: 'Team name already exists' });
    }

    // Create team with current user as leader
    const team = await Team.create({
        name,
        hackathon: hackathonId,
        leader: req.user._id,
        members: [req.user._id],
        description,
        skills
    });

    res.status(201).json(team);
});

// @desc    Get team details
// @route   GET /api/teams/:id
// @access  Private
export const getTeamById = asyncHandler(async(req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('leader', 'name email')
            .populate('members', 'name email')
            .populate('hackathon', 'name startDate endDate')
            .populate('project');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Remove any virtual properties or transformations that might cause issues
        const teamObject = team.toObject ? team.toObject() : team;

        res.json(teamObject);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



// @desc    Invite team member
// @route   POST /api/teams/:id/invite
// @access  Private
export const inviteTeamMember = asyncHandler(async(req, res) => {
    const team = await Team.findById(req.params.id);
    const invitedUser = await User.findById(req.body.userId);

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (!invitedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check team size limit
    const hackathon = await Hackathon.findById(team.hackathon);
    if (team.members.length >= hackathon.maxTeamSize) {
        return res.status(400).json({ message: 'Team is already full' });
    }

    // Check if user is already invited or a member
    const isAlreadyInvited = team.invitedMembers.some(
        invite => invite.user.toString() === invitedUser._id.toString()
    );
    const isAlreadyMember = team.members.some(
        member => member.toString() === invitedUser._id.toString()
    );

    if (isAlreadyInvited || isAlreadyMember) {
        return res.status(400).json({ message: 'User is already invited or a team member' });
    }

    // Add invitation
    team.invitedMembers.push({
        user: invitedUser._id,
        status: 'pending'
    });

    await team.save();

    res.status(200).json({
        message: 'Invitation sent successfully',
        team
    });
});

// @desc    Accept team invitation
// @route   PUT /api/teams/:id/accept-invite
// @access  Private
export const acceptTeamInvite = asyncHandler(async(req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    // Check team size limit
    const hackathon = await Hackathon.findById(team.hackathon);
    if (team.members.length >= hackathon.maxTeamSize) {
        return res.status(400).json({ message: 'Team is already full' });
    }

    // Find and update invitation
    const invitationIndex = team.invitedMembers.findIndex(
        invite => invite.user.toString() === req.user._id.toString()
    );

    if (invitationIndex === -1) {
        return res.status(400).json({ message: 'No invitation found' });
    }

    // Update invitation status
    team.invitedMembers[invitationIndex].status = 'accepted';

    // Add user to team members
    team.members.push(req.user._id);

    // Remove invitation
    team.invitedMembers.splice(invitationIndex, 1);

    await team.save();

    res.status(200).json({
        message: 'Invitation accepted successfully',
        team
    });
});

// @desc    Remove team member
// @route   DELETE /api/teams/:id/remove-member
// @access  Private (Team Leader)
export const removeTeamMember = asyncHandler(async(req, res) => {
    const team = await Team.findById(req.params.id);
    const memberToRemove = await User.findById(req.body.userId);

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (!memberToRemove) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Ensure only team leader can remove members
    if (team.leader.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only team leader can remove members' });
    }

    // Remove member
    team.members = team.members.filter(
        member => member.toString() !== memberToRemove._id.toString()
    );

    await team.save();

    res.status(200).json({
        message: 'Member removed successfully',
        team
    });
});

// @desc    Update team details
// @route   PUT /api/teams/:id
// @access  Private (Team Leader)
export const updateTeam = asyncHandler(async(req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure only team leader can update
    if (team.leader.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only team leader can update team details' });
    }

    // Updatable fields
    const updatableFields = ['name', 'description', 'skills'];

    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            team[field] = req.body[field];
        }
    });

    await team.save();

    res.status(200).json({
        message: 'Team updated successfully',
        team
    });
});