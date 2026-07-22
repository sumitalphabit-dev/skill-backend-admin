const SeminarEvent = require('../models/SeminarEvent');
const SeminarRegistration = require('../models/SeminarRegistration');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Get currently active seminar event (Public)
// @route   GET /api/seminars/current
// @access  Public
const getCurrentSeminarEvent = catchAsync(async (req, res) => {
    const event = await SeminarEvent.findOne({ isActive: true });
    if (!event) {
        throw new AppError('No active seminar event found', 404);
    }

    const registeredCount = await SeminarRegistration.countDocuments({
        seminarBatch: event.batchId,
        status: { $ne: 'cancelled' }
    });

    const seatsLeft = Math.max(0, event.totalSeats - registeredCount);

    res.status(200).json({
        success: true,
        data: {
            ...event.toObject(),
            registeredCount,
            seatsLeft
        }
    });
});

// @desc    Get all seminar events (Admin)
// @route   GET /api/admin/seminar-events
// @access  Private/Admin
const getSeminarEvents = catchAsync(async (req, res) => {
    const events = await SeminarEvent.find().sort({ date: -1, createdAt: -1 });

    const eventsWithCounts = await Promise.all(events.map(async (event) => {
        const registeredCount = await SeminarRegistration.countDocuments({
            seminarBatch: event.batchId,
            status: { $ne: 'cancelled' }
        });
        return {
            ...event.toObject(),
            registeredCount,
            seatsLeft: Math.max(0, event.totalSeats - registeredCount)
        };
    }));

    res.status(200).json({
        success: true,
        count: eventsWithCounts.length,
        data: eventsWithCounts
    });
});

// @desc    Get single seminar event by ID (Admin)
// @route   GET /api/admin/seminar-events/:id
// @access  Private/Admin
const getSeminarEventById = catchAsync(async (req, res) => {
    const event = await SeminarEvent.findById(req.params.id);
    if (!event) {
        throw new AppError('Seminar event not found', 404);
    }

    const registeredCount = await SeminarRegistration.countDocuments({
        seminarBatch: event.batchId,
        status: { $ne: 'cancelled' }
    });

    res.status(200).json({
        success: true,
        data: {
            ...event.toObject(),
            registeredCount,
            seatsLeft: Math.max(0, event.totalSeats - registeredCount)
        }
    });
});

// @desc    Create a new seminar event (Admin)
// @route   POST /api/admin/seminar-events
// @access  Private/Admin
const createSeminarEvent = catchAsync(async (req, res) => {
    try {
        const shouldBeActive = req.body.isActive === true || req.body.isActive === 'true';

        if (shouldBeActive) {
            await SeminarEvent.updateMany({}, { isActive: false });
        }

        const eventData = {
            batchId: req.body.batchId,
            topic: req.body.topic,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            mode: req.body.mode || 'Offline',
            venue: req.body.venue,
            venueMapLink: req.body.venueMapLink,
            language: req.body.language || 'English & Gujarati/Hindi mix',
            totalSeats: req.body.totalSeats ? parseInt(req.body.totalSeats, 10) : 100,
            isActive: shouldBeActive
        };

        if (req.files && req.files.venueImage && req.files.venueImage[0]) {
            eventData.venueImage = req.files.venueImage[0].path;
        } else if (req.file) {
            eventData.venueImage = req.file.path;
        }

        const event = await SeminarEvent.create(eventData);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('A seminar event with this Batch ID already exists.', 409);
        }
        throw error;
    }
});

// @desc    Update seminar event by ID (Admin)
// @route   PUT /api/admin/seminar-events/:id
// @access  Private/Admin
const updateSeminarEvent = catchAsync(async (req, res) => {
    let event = await SeminarEvent.findById(req.params.id);
    if (!event) {
        throw new AppError('Seminar event not found', 404);
    }

    const updateData = {};

    if (req.body.batchId !== undefined) updateData.batchId = req.body.batchId;
    if (req.body.topic !== undefined) updateData.topic = req.body.topic;
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.startTime !== undefined) updateData.startTime = req.body.startTime;
    if (req.body.endTime !== undefined) updateData.endTime = req.body.endTime;
    if (req.body.mode !== undefined) updateData.mode = req.body.mode;
    if (req.body.venue !== undefined) updateData.venue = req.body.venue;
    if (req.body.venueMapLink !== undefined) updateData.venueMapLink = req.body.venueMapLink;
    if (req.body.language !== undefined) updateData.language = req.language;
    if (req.body.totalSeats !== undefined) updateData.totalSeats = parseInt(req.body.totalSeats, 10);

    if (req.body.isActive !== undefined) {
        const shouldBeActive = req.body.isActive === true || req.body.isActive === 'true';
        updateData.isActive = shouldBeActive;
        if (shouldBeActive) {
            await SeminarEvent.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
        }
    }

    if (req.files && req.files.venueImage && req.files.venueImage[0]) {
        updateData.venueImage = req.files.venueImage[0].path;
    } else if (req.file) {
        updateData.venueImage = req.file.path;
    }

    try {
        event = await SeminarEvent.findByIdAndUpdate(req.params.id, updateData, {
            returnDocument: 'after',
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('A seminar event with this Batch ID already exists.', 409);
        }
        throw error;
    }
});

// @desc    Delete seminar event by ID (Admin)
// @route   DELETE /api/admin/seminar-events/:id
// @access  Private/Admin
const deleteSeminarEvent = catchAsync(async (req, res) => {
    const event = await SeminarEvent.findByIdAndDelete(req.params.id);
    if (!event) {
        throw new AppError('Seminar event not found', 404);
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Activate a seminar event (sets isActive: true and all others isActive: false)
// @route   PATCH /api/admin/seminar-events/:id/activate
// @access  Private/Admin
const activateSeminarEvent = catchAsync(async (req, res) => {
    const event = await SeminarEvent.findById(req.params.id);
    if (!event) {
        throw new AppError('Seminar event not found', 404);
    }

    await SeminarEvent.updateMany({}, { isActive: false });

    event.isActive = true;
    await event.save();

    res.status(200).json({
        success: true,
        data: event
    });
});

module.exports = {
    getCurrentSeminarEvent,
    getSeminarEvents,
    getSeminarEventById,
    createSeminarEvent,
    updateSeminarEvent,
    deleteSeminarEvent,
    activateSeminarEvent
};
