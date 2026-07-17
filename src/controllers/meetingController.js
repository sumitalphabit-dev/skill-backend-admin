const Meeting = require('../models/Meeting');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Public
const getMeetings = catchAsync(async (req, res) => {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: meetings.length, data: meetings });
});

// @desc    Get single meeting by ID
// @route   GET /api/meetings/:id
// @access  Public
const getMeetingById = catchAsync(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
        throw new AppError('Meeting not found', 404);
    }
    res.status(200).json({ success: true, data: meeting });
});

// @desc    Create new meeting
// @route   POST /api/admin/meetings
// @access  Private/Admin
const createMeeting = catchAsync(async (req, res) => {
    const meetingData = {
        title: req.body.title,
        subtitle: req.body.subtitle
    };
    
    if (req.files) {
        if (req.files.image1 && req.files.image1[0]) {
            meetingData.image1 = req.files.image1[0].path;
        }
        if (req.files.image2 && req.files.image2[0]) {
            meetingData.image2 = req.files.image2[0].path;
        }
    }
    
    const meeting = await Meeting.create(meetingData);
    res.status(201).json({ success: true, data: meeting });
});

// @desc    Update meeting by ID
// @route   PUT /api/admin/meetings/:id
// @access  Private/Admin
const updateMeetingById = catchAsync(async (req, res) => {
    console.log('UPDATING MEETING ID:', req.params.id);
    let meeting = await Meeting.findById(req.params.id);
    console.log('MEETING FOUND IN DB:', meeting);
    if (!meeting) {
        throw new AppError('Meeting not found', 404);
    }
    
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.subtitle !== undefined) updateData.subtitle = req.body.subtitle;
    
    if (req.files) {
        if (req.files.image1 && req.files.image1[0]) {
            updateData.image1 = req.files.image1[0].path;
        }
        if (req.files.image2 && req.files.image2[0]) {
            updateData.image2 = req.files.image2[0].path;
        }
    }
    
    meeting = await Meeting.findByIdAndUpdate(req.params.id, updateData, {
        returnDocument: 'after',
        runValidators: true
    });
    
    res.status(200).json({ success: true, data: meeting });
});

// @desc    Delete meeting
// @route   DELETE /api/admin/meetings/:id
// @access  Private/Admin
const deleteMeetingById = catchAsync(async (req, res) => {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
        throw new AppError('Meeting not found', 404);
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = {
    getMeetings,
    getMeetingById,
    createMeeting,
    updateMeetingById,
    deleteMeetingById
};
