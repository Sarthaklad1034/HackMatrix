// import mongoose from 'mongoose';

// const ProjectSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: [true, 'Please provide a project title'],
//         trim: true,
//         maxlength: [100, 'Project title cannot exceed 100 characters']
//     },
//     description: {
//         type: String,
//         required: [true, 'Please provide a project description'],
//         maxlength: [2000, 'Project description cannot exceed 2000 characters']
//     },
//     team: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Team',
//         required: [true, 'Project must be associated with a team']
//     },
//     hackathon: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Hackathon',
//         required: [true, 'Project must be associated with a hackathon']
//     },
//     technologiesUsed: [String],
//     githubRepository: {
//         type: String,
//         validate: {
//             validator: function(v) {
//                 return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/.test(v);
//             },
//             message: 'Please provide a valid GitHub repository URL'
//         }
//     },
//     demoVideoUrl: {
//         type: String,
//         validate: {
//             validator: function(v) {
//                 return /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com)\/.+$/.test(v);
//             },
//             message: 'Please provide a valid YouTube or Vimeo video URL'
//         }
//     },
//     presentation: {
//         type: String, // URL to presentation file
//         validate: {
//             validator: function(v) {
//                 return /\.(pdf|pptx?|key)$/i.test(v);
//             },
//             message: 'Presentation must be a PDF, PowerPoint, or Keynote file'
//         }
//     },
//     submissionStatus: {
//         type: String,
//         enum: ['draft', 'submitted', 'incomplete'],
//         default: 'draft'
//     },
//     submissionDate: Date,
//     problemStatement: {
//         type: String,
//         maxlength: [500, 'Problem statement cannot exceed 500 characters']
//     },
//     uniqueValue: {
//         type: String,
//         maxlength: [500, 'Unique value proposition cannot exceed 500 characters']
//     },
//     totalScores: [{
//         judge: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         score: Number,
//         criteria: [{
//             name: String,
//             score: Number
//         }]
//     }],
//     finalScore: {
//         type: Number,
//         default: 0
//     },
//     rank: Number
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Middleware to update submission status and date
// ProjectSchema.pre('save', function(next) {
//     if (this.isModified('submissionStatus') && this.submissionStatus === 'submitted') {
//         this.submissionDate = new Date();
//     }

//     // Calculate final score
//     if (this.totalScores && this.totalScores.length > 0) {
//         const totalScore = this.totalScores.reduce((acc, scoreObj) => acc + scoreObj.score, 0);
//         this.finalScore = totalScore / this.totalScores.length;
//     }

//     next();
// });

// // Virtual to check if project is fully submitted
// ProjectSchema.virtual('isFullySubmitted').get(function() {
//     return this.submissionStatus === 'submitted' &&
//         this.description &&
//         this.technologiesUsed.length > 0 &&
//         this.githubRepository &&
//         this.demoVideoUrl;
// });

// const Project = mongoose.model('Project', ProjectSchema);

// export default Project;

import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true,
        maxlength: [100, 'Project title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a project description'],
        maxlength: [2000, 'Project description cannot exceed 2000 characters']
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Project must be associated with a team']
    },
    hackathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Project must be associated with a hackathon']
    },
    technologiesUsed: [String],
    githubRepository: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/.test(v);
            },
            message: 'Please provide a valid GitHub repository URL'
        }
    },
    demoVideoUrl: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com)\/.+$/.test(v);
            },
            message: 'Please provide a valid YouTube or Vimeo video URL'
        }
    },
    presentation: {
        type: String,
        validate: {
            validator: function(v) {
                return v ? /\.(pdf|pptx?|key)$/i.test(v) : true;
            },
            message: 'Presentation must be a PDF, PowerPoint, or Keynote file'
        }
    },
    submissionStatus: {
        type: String,
        enum: ['draft', 'submitted', 'incomplete'],
        default: 'draft'
    },
    submissionDate: Date,
    problemStatement: {
        type: String,
        maxlength: [500, 'Problem statement cannot exceed 500 characters']
    },
    uniqueValue: {
        type: String,
        maxlength: [500, 'Unique value proposition cannot exceed 500 characters']
    },
    totalScores: [{
        judge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        overallComments: String,
        criteria: [{
            name: String,
            score: Number
        }]
    }],
    finalScore: {
        type: Number,
        default: 0
    },
    rank: Number
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to update submission status and date
ProjectSchema.pre('save', function(next) {
    // Set submission date when status changes to submitted
    if (this.isModified('submissionStatus') && this.submissionStatus === 'submitted') {
        this.submissionDate = new Date();
    }

    // Calculate final score based on total scores
    if (this.totalScores && this.totalScores.length > 0) {
        const totalScore = this.totalScores.reduce((acc, scoreObj) => acc + (scoreObj.score || 0), 0);
        this.finalScore = totalScore / this.totalScores.length;
    }

    next();
});

// Virtual to check if project is fully submitted
ProjectSchema.virtual('isFullySubmitted').get(function() {
    return this.submissionStatus === 'submitted' &&
        this.description &&
        this.technologiesUsed && this.technologiesUsed.length > 0 &&
        this.githubRepository &&
        this.demoVideoUrl;
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;