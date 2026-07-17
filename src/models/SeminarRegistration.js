const mongoose = require('mongoose');

const seminarRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please add a valid email']
    },
    college: {
        type: String,
        required: [true, 'Please add your college/school name'],
        trim: true,
        maxlength: [150, 'College name cannot be more than 150 characters']
    },
    course: {
        type: String,
        required: [true, 'Please add your current course/stream'],
        trim: true,
        maxlength: [100, 'Course cannot be more than 100 characters']
    },
    city: {
        type: String,
        required: [true, 'Please add your city'],
        trim: true,
        maxlength: [100, 'City cannot be more than 100 characters']
    },
    source: {
        type: String,
        enum: ['Instagram', 'Friend / Referral', 'College Notice', 'Google Search', 'Other'],
        default: 'Other'
    },
    seminarBatch: {
        type: String,
        required: [true, 'Please specify the seminar batch'],
        trim: true
    },
    status: {
        type: String,
        enum: ['registered', 'attended', 'no-show', 'cancelled'],
        default: 'registered'
    }
}, {
    timestamps: true
});

// Prevent duplicate registration: same phone number cannot register twice
// for the same seminarBatch
seminarRegistrationSchema.index({ phone: 1, seminarBatch: 1 }, { unique: true });

module.exports = mongoose.model('SeminarRegistration', seminarRegistrationSchema);
