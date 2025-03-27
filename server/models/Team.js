import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a team name'],
        trim: true,
        maxlength: [50, 'Team name cannot exceed 50 characters'],
        unique: true
    },
    hackathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Team must be associated with a hackathon']
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Team must have a leader']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    invitedMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],
    status: {
        type: String,
        enum: ['forming', 'complete', 'disqualified'],
        default: 'forming'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    skills: [String],
    description: {
        type: String,
        maxlength: [500, 'Team description cannot exceed 500 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validate team size
TeamSchema.pre('save', function(next) {
    const hackathon = this.hackathon;
    const maxTeamSize = hackathon.maxTeamSize || 4;

    if (this.members.length > maxTeamSize) {
        return next(new Error(`Team cannot exceed ${maxTeamSize} members`));
    }

    // Update team status
    this.status = this.members.length === maxTeamSize ? 'complete' : 'forming';

    next();
});

// Virtual to get total team members
TeamSchema.virtual('totalMembers').get(function() {
    return this.members.length;
});

const Team = mongoose.model('Team', TeamSchema);

export default Team;