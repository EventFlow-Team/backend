const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    kind: [String],
    rating: Number
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema)

module.exports = {
    Event,
    eventSchema,
};