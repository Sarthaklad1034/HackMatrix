import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Hackathon from '../models/Hackathon.js';
import Score from '../models/Score.js';

// @desc    Get assigned hackathons for judge
// @route   GET /api/judges/hackathons
// @access  Private (Judge)
export const getAssignedHackathons = asyncHandler(async(req, res) => {
    const hackathons = await Hackathon.find({
        judges: req.user._id
    }).select('name description startDate endDate');

    res.json(hackathons);
});

// @desc    Get projects for judging in a specific hackathon
// @route   GET /api/judges/hackathons/:hackathonId/projects
// @access  Private (Judge)
export const getProjectsForJudging = asyncHandler(async(req, res) => {
    // Verify judge is assigned to this hackathon
    const hackathon = await Hackathon.findById(req.params.hackathonId);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (!hackathon.judges.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to judge this hackathon' });
    }

    const projects = await Project.find({
            hackathon: req.params.hackathonId,
            submissionStatus: 'submitted'
        })
        .populate('team', 'name members')
        .select('-totalScores');

    res.json(projects);
});

// @desc    Submit comprehensive project scoring
// @route   POST /api/judges/projects/:projectId/score
// @access  Private (Judge)
export const submitProjectScore = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const {
        scoreCriteria,
        overallComments,
        hackathonId
    } = req.body;

    // Verify judge is assigned to this hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon.judges.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to judge this project' });
    }

    // Create or update score
    const scoreData = {
        project: project._id,
        judge: req.user._id,
        hackathon: hackathonId,
        scoreCriteria,
        overallComments,
        totalScore: calculateTotalScore(scoreCriteria)
    };

    const existingScore = await Score.findOneAndUpdate({
            project: project._id,
            judge: req.user._id,
            hackathon: hackathonId
        },
        scoreData, { upsert: true, new: true }
    );

    res.json(existingScore);
});

// @desc    Get judge's scores for a hackathon
// @route   GET /api/judges/hackathons/:hackathonId/scores
// @access  Private (Judge)
export const getJudgeScores = asyncHandler(async(req, res) => {
    const scores = await Score.find({
            judge: req.user._id,
            hackathon: req.params.hackathonId
        })
        .populate('project', 'title team')
        .select('project totalScore scoreCriteria overallComments');

    res.json(scores);
});

// Helper function to calculate total score
function calculateTotalScore(criteria) {
    if (!criteria || criteria.length === 0) return 0;

    const totalScore = criteria.reduce((sum, criterion) =>
        sum + ((criterion.score || 0) * (criterion.weight || 1)), 0
    );

    const totalWeight = criteria.reduce((sum, criterion) =>
        sum + (criterion.weight || 1), 0
    );

    return totalScore / totalWeight;
}

// @desc    Get scoring criteria for a hackathon
// @route   GET /api/judges/hackathons/:hackathonId/scoring-criteria
// @access  Private (Judge)
export const getHackathonScoringCriteria = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.hackathonId);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Default scoring criteria if not specified
    const defaultCriteria = [{
            name: 'Innovation',
            description: 'Creativity and uniqueness of the solution',
            weight: 3
        },
        {
            name: 'Technical Complexity',
            description: 'Technical difficulty and implementation',
            weight: 3
        },
        {
            name: 'Presentation',
            description: 'Quality of project presentation and communication',
            weight: 2
        },
        {
            name: 'Potential Impact',
            description: 'Potential real-world application and scalability',
            weight: 2
        }
    ];

    res.json(hackathon.scoringCriteria || defaultCriteria);
});