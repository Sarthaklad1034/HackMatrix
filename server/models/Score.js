import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Score must be associated with a project']
    },
    judge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Score must be associated with a judge']
    },
    hackathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Score must be associated with a hackathon']
    },
    scoreCriteria: [{
        name: {
            type: String,
            required: [true, 'Scoring criteria name is required']
        },
        weight: {
            type: Number,
            default: 1,
            min: [0, 'Weight cannot be negative'],
            max: [10, 'Weight cannot exceed 10']
        },
        score: {
            type: Number,
            required: [true, 'Score is required'],
            min: [0, 'Score cannot be negative'],
            max: [10, 'Score cannot exceed 10']
        },
        comments: {
            type: String,
            maxlength: [500, 'Comments cannot exceed 500 characters']
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    overallComments: {
        type: String,
        maxlength: [1000, 'Overall comments cannot exceed 1000 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to calculate total score
ScoreSchema.pre('save', function(next) {
    // Calculate total score based on weighted criteria
    if (this.scoreCriteria && this.scoreCriteria.length > 0) {
        this.totalScore = this.scoreCriteria.reduce((total, criteria) => {
            return total + (criteria.score * criteria.weight);
        }, 0) / this.scoreCriteria.reduce((total, criteria) => total + criteria.weight, 0);
    }

    next();
});

// Virtual to get weighted average
ScoreSchema.virtual('weightedAverage').get(function() {
    return this.totalScore;
});

const Score = mongoose.model('Score', ScoreSchema);

export default Score;