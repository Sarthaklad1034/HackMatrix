// import asyncHandler from 'express-async-handler';
// import Project from '../models/Project.js';
// import Team from '../models/Team.js';
// import Hackathon from '../models/Hackathon.js';

// // @desc    Create project submission
// // @route   POST /api/projects
// // @access  Private (Team Leader)
// export const createProject = asyncHandler(async(req, res) => {
//     const {
//         teamId,
//         hackathonId,
//         title,
//         description,
//         technologiesUsed,
//         githubRepository,
//         demoVideoUrl,
//         problemStatement,
//         uniqueValue
//     } = req.body;

//     // Validate team and hackathon
//     const team = await Team.findById(teamId);
//     const hackathon = await Hackathon.findById(hackathonId);

//     if (!team) {
//         return res.status(404).json({ message: 'Team not found' });
//     }

//     if (!hackathon) {
//         return res.status(404).json({ message: 'Hackathon not found' });
//     }

//     // Ensure only team leader can create project
//     if (team.leader.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'Only team leader can submit project' });
//     }

//     // Check hackathon submission period
//     const now = new Date();
//     if (now < hackathon.startDate || now > hackathon.endDate) {
//         return res.status(400).json({ message: 'Project submission is not allowed at this time' });
//     }

//     // Create project
//     const project = await Project.create({
//         title,
//         description,
//         team: teamId,
//         hackathon: hackathonId,
//         technologiesUsed,
//         githubRepository,
//         demoVideoUrl,
//         problemStatement,
//         uniqueValue,
//         submissionStatus: 'submitted'
//     });

//     // Link project to team
//     team.project = project._id;
//     await team.save();

//     res.status(201).json(project);
// });

// // @desc    Get project details
// // @route   GET /api/projects/:id
// // @access  Private
// export const getProjectById = asyncHandler(async(req, res) => {
//     const project = await Project.findById(req.params.id)
//         .populate('team', 'name members')
//         .populate('hackathon', 'name startDate endDate')
//         .populate('totalScores.judge', 'name email');

//     if (!project) {
//         return res.status(404).json({ message: 'Project not found' });
//     }

//     res.json(project);
// });

// // @desc    Get projects for a hackathon
// // @route   GET /api/projects/hackathon/:hackathonId
// // @access  Private
// export const getProjectsByHackathon = asyncHandler(async(req, res) => {
//     const projects = await Project.find({
//             hackathon: req.params.hackathonId
//         })
//         .populate('team', 'name members')
//         .select('-totalScores');

//     res.json(projects);
// });

// // @desc    Update project submission
// // @route   PUT /api/projects/:id
// // @access  Private (Team Leader)
// export const updateProject = asyncHandler(async(req, res) => {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//         return res.status(404).json({ message: 'Project not found' });
//     }

//     // Verify team leadership
//     const team = await Team.findById(project.team);
//     if (team.leader.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'Only team leader can update project' });
//     }

//     // Updatable fields
//     const updatableFields = [
//         'title', 'description', 'technologiesUsed',
//         'githubRepository', 'demoVideoUrl',
//         'problemStatement', 'uniqueValue'
//     ];

//     updatableFields.forEach(field => {
//         if (req.body[field] !== undefined) {
//             project[field] = req.body[field];
//         }
//     });

//     // Update submission status if all required fields are present
//     if (project.isFullySubmitted) {
//         project.submissionStatus = 'submitted';
//     }

//     await project.save();

//     res.json(project);
// });

// // @desc    Submit project score
// // @route   POST /api/projects/:id/score
// // @access  Private (Judge)
// export const submitProjectScore = asyncHandler(async(req, res) => {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//         return res.status(404).json({ message: 'Project not found' });
//     }

//     const { scoreCriteria, overallComments } = req.body;

//     // Add or update judge's score
//     const existingScoreIndex = project.totalScores.findIndex(
//         score => score.judge.toString() === req.user._id.toString()
//     );

//     if (existingScoreIndex !== -1) {
//         // Update existing score
//         project.totalScores[existingScoreIndex] = {
//             judge: req.user._id,
//             score: calculateTotalScore(scoreCriteria),
//             criteria: scoreCriteria
//         };
//     } else {
//         // Add new score
//         project.totalScores.push({
//             judge: req.user._id,
//             score: calculateTotalScore(scoreCriteria),
//             criteria: scoreCriteria
//         });
//     }

//     await project.save();

//     res.json(project);
// });

// // Helper function to calculate total score
// function calculateTotalScore(criteria) {
//     if (!criteria || criteria.length === 0) return 0;

//     const totalScore = criteria.reduce((sum, criterion) =>
//         sum + (criterion.score || 0), 0
//     );

//     return totalScore / criteria.length;
// }

// // @desc    Finalize project rankings
// // @route   POST /api/projects/hackathon/:hackathonId/rankings
// // @access  Private (Organizer)
// export const finalizeProjectRankings = asyncHandler(async(req, res) => {
//     const hackathon = await Hackathon.findById(req.params.hackathonId);

//     if (!hackathon) {
//         return res.status(404).json({ message: 'Hackathon not found' });
//     }

//     // Get all projects for this hackathon
//     const projects = await Project.find({
//         hackathon: req.params.hackathonId
//     });

//     // Sort projects by final score in descending order
//     const rankedProjects = projects.sort((a, b) => b.finalScore - a.finalScore);

//     // Assign ranks
//     rankedProjects.forEach((project, index) => {
//         project.rank = index + 1;
//         project.save();
//     });

//     res.json(rankedProjects);
// });
import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import Hackathon from '../models/Hackathon.js';

// Helper function to calculate total score
function calculateTotalScore(criteria) {
    if (!criteria || criteria.length === 0) return 0;

    return criteria.reduce((sum, criterion) =>
        sum + (criterion.score || 0), 0
    ) / criteria.length;
}

// @desc    Create project submission
// @route   POST /api/projects
// @access  Private (Team Leader)
export const createProject = asyncHandler(async(req, res) => {
    const {
        teamId,
        hackathonId,
        title,
        description,
        technologiesUsed,
        githubRepository,
        demoVideoUrl,
        problemStatement,
        uniqueValue,
        presentation
    } = req.body;

    // Validate team and hackathon
    const team = await Team.findById(teamId);
    const hackathon = await Hackathon.findById(hackathonId);

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Ensure only team leader can create project
    if (team.leader.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only team leader can submit project' });
    }

    // Check hackathon submission period
    const now = new Date();
    if (now < hackathon.startDate || now > hackathon.endDate) {
        return res.status(400).json({ message: 'Project submission is not allowed at this time' });
    }

    // Create project
    const project = await Project.create({
        title,
        description,
        team: teamId,
        hackathon: hackathonId,
        technologiesUsed,
        githubRepository,
        demoVideoUrl,
        problemStatement,
        uniqueValue,
        presentation,
        submissionStatus: 'submitted'
    });

    // Link project to team
    team.project = project._id;
    await team.save();

    res.status(201).json(project);
});

// @desc    Get project details
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('team', 'name members')
        .populate('hackathon', 'name startDate endDate')
        .populate('totalScores.judge', 'name email');

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
});

// @desc    Get projects for a hackathon
// @route   GET /api/projects/hackathon/:hackathonId
// @access  Private
export const getProjectsByHackathon = asyncHandler(async(req, res) => {
    const projects = await Project.find({
            hackathon: req.params.hackathonId
        })
        .populate('team', 'name members')
        .select('-totalScores');

    res.json(projects);
});

// @desc    Update project submission
// @route   PUT /api/projects/:id
// @access  Private (Team Leader)
export const updateProject = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Verify team leadership
    const team = await Team.findById(project.team);
    if (team.leader.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only team leader can update project' });
    }

    // Updatable fields
    const updatableFields = [
        'title', 'description', 'technologiesUsed',
        'githubRepository', 'demoVideoUrl',
        'problemStatement', 'uniqueValue',
        'presentation'
    ];

    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            project[field] = req.body[field];
        }
    });

    // Update submission status if all required fields are present
    if (project.isFullySubmitted) {
        project.submissionStatus = 'submitted';
    }

    await project.save();

    res.json(project);
});

// @desc    Submit project score
// @route   POST /api/projects/:id/score
// @access  Private (Judge)
export const submitProjectScore = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const { scoreCriteria, overallComments } = req.body;

    // Add or update judge's score
    const existingScoreIndex = project.totalScores.findIndex(
        score => score.judge.toString() === req.user._id.toString()
    );

    if (existingScoreIndex !== -1) {
        // Update existing score
        project.totalScores[existingScoreIndex] = {
            judge: req.user._id,
            score: calculateTotalScore(scoreCriteria),
            criteria: scoreCriteria,
            overallComments
        };
    } else {
        // Add new score
        project.totalScores.push({
            judge: req.user._id,
            score: calculateTotalScore(scoreCriteria),
            criteria: scoreCriteria,
            overallComments
        });
    }

    await project.save();

    res.json(project);
});

// @desc    Finalize project rankings
// @route   POST /api/projects/hackathon/:hackathonId/rankings
// @access  Private (Organizer)
export const finalizeProjectRankings = asyncHandler(async(req, res) => {
    const hackathon = await Hackathon.findById(req.params.hackathonId);

    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Get all projects for this hackathon
    const projects = await Project.find({
        hackathon: req.params.hackathonId
    });

    // Sort projects by final score in descending order
    const rankedProjects = projects.sort((a, b) => b.finalScore - a.finalScore);

    // Assign ranks
    const updatedProjects = await Promise.all(rankedProjects.map(async(project, index) => {
        project.rank = index + 1;
        return await project.save();
    }));

    res.json(updatedProjects);
});

export default {
    createProject,
    getProjectById,
    getProjectsByHackathon,
    updateProject,
    submitProjectScore,
    finalizeProjectRankings
};