const mongoose = require('mongoose')

const lineSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    standId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stand',
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
    timeEstimate: {
        type: Number,
        required: true
    },
    group: {
        type: Number,
        required: true
    },
    steps: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Line = mongoose.model('Line', lineSchema)

module.exports = {
    Line,
    lineSchema,
};