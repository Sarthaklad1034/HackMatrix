import asyncHandler from 'express-async-handler';
import Hackathon from '../models/Hackathon.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

// @desc    Create a new hackathon
// @route   POST /api/hackathons
// @access  Private (Organizer/Admin)
export const createHackathon = asyncHandler(async(req, res) => {
    const {
        name,
        description,
        startDate,
        endDate,
        registrationStartDate,
        registrationEndDate,
        theme,
        challenges,
        prizes,
        maxTeamSize,
        location,
        isVirtual,
        tags,
        sponsors
    } = req.body;

    try {
        const hackathon = await Hackathon.create({
            name,
            description,
            startDate,
            endDate,
            registrationStartDate,
            registrationEndDate,
            organizer: req.user._id,
            theme,
            challenges,
            prizes,
            maxTeamSize,
            location,
            isVirtual,
            tags,
            sponsors
        });

        res.status(201).json(hackathon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
export const getHackathons = asyncHandler(async(req, res) => {
    const { status, theme, tags } = req.query;

    let query = {};

    if (status) query.status = status;
    if (theme) query.theme = { $regex: theme, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };

    const hackathons = await Hackathon.find(query)
        .populate('organizer', 'name email')
        .select('-registeredTeams -judges');

    res.json(hackathons);
});

// @desc    Get single hackathon details
// @route   GET /api/hackathons/:id
// @access  Public
export const getHackathonById = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('registeredTeams', 'name members')
        .populate('judges', 'name email');

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(hackathon);
});

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private (Organizer/Admin)
export const updateHackathon = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Ensure only organizer or admin can update
    if (hackathon.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this hackathon' });
    }

    // Update fields
    const updatableFields = [
        'name', 'description', 'startDate', 'endDate',
        'registrationStartDate', 'registrationEndDate',
        'theme', 'challenges', 'prizes', 'maxTeamSize',
        'location', 'isVirtual', 'tags', 'sponsors'
    ];

    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            hackathon[field] = req.body[field];
        }
    });

    const updatedHackathon = await hackathon.save();
    res.json(updatedHackathon);
});

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private (Organizer/Admin)
export const deleteHackathon = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (hackathon.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    await Team.deleteMany({ hackathon: hackathon._id });

    // Directly delete by ID
    await Hackathon.findByIdAndDelete(req.params.id);

    res.json({ message: 'Hackathon deleted successfully' });
});


// @desc    Register team for hackathon
// @route   POST /api/hackathons/:id/register-team
// @access  Private
export const registerTeamForHackathon = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);
    const team = await Team.findById(req.body.teamId);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    // Check registration period
    const now = new Date();
    if (now < hackathon.registrationStartDate || now > hackathon.registrationEndDate) {
        return res.status(400).json({ message: 'Registration is not open' });
    }

    // Check if team is already registered
    if (hackathon.registeredTeams.includes(team._id)) {
        return res.status(400).json({ message: 'Team already registered' });
    }

    // Add team to hackathon
    hackathon.registeredTeams.push(team._id);
    await hackathon.save();

    res.status(200).json({
        message: 'Team registered successfully',
        hackathon
    });
});

// @desc    Add judge to hackathon
// @route   POST /api/hackathons/:id/add-judge
// @access  Private (Organizer/Admin)
export const addJudgeToHackathon = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);
    const judge = await User.findById(req.body.judgeId);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (!judge) {
        return res.status(404).json({ message: 'Judge not found' });
    }

    // Verify judge role
    if (judge.role !== 'judge') {
        return res.status(400).json({ message: 'Selected user is not a judge' });
    }

    // Check if judge is already added
    if (hackathon.judges.includes(judge._id)) {
        return res.status(400).json({ message: 'Judge already added' });
    }

    // Add judge to hackathon
    hackathon.judges.push(judge._id);
    await hackathon.save();

    res.status(200).json({
        message: 'Judge added successfully',
        hackathon
    });
});