import mongoose from 'mongoose';

const HackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    registeredTeams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' // Assuming there's a "Team" model
    }],
    judges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming judges are stored in the "User" model
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to set default status if not provided
HackathonSchema.pre('save', function(next) {
    if (!this.status) {
        this.status = 'upcoming'; // Default status if not set
    }
    next();
});

const Hackathon = mongoose.model('Hackathon', HackathonSchema);

export default Hackathon;