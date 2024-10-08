const mongoose = require('mongoose')

const standSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }, 
    startDate: {
        type: Date,
        required: true
    },
    breakDate: [Date],
    finishDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    kind: [String],
    image: {
        type: String,
        required:true
    },
    rating: Number,
    giftDescription: [String],
    giftImage: [String],  
    buffetMenu: [String],
}, { timestamps: true });

const Stand = mongoose.model('Stand', standSchema)

module.exports = {
    Stand,
    standSchema,
};