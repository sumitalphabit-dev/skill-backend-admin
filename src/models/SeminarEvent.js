const mongoose = require('mongoose');

const seminarEventSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: [true, 'Please add a batch identifier'],
        unique: true,
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Please add a topic'],
        trim: true,
        maxlength: [150, 'Topic cannot be more than 150 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    startTime: {
        type: String,
        required: [true, 'Please add a start time'],
        trim: true
    },
    endTime: {
        type: String,
        required: [true, 'Please add an end time'],
        trim: true
    },
    mode: {
        type: String,
        enum: ['Offline', 'Online', 'Hybrid'],
        default: 'Offline'
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue'],
        trim: true
    },
    venueMapLink: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true,
        default: 'English & Gujarati/Hindi mix'
    },
    venueImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    totalSeats: {
        type: Number,
        required: [true, 'Please add total seats'],
        default: 100
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SeminarEvent', seminarEventSchema);
