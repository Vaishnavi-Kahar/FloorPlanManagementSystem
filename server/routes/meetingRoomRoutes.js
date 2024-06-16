const express = require('express');
const router = express.Router();
const meetingRoomController = require('../controllers/meetingRoomController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route POST /api/meeting-rooms/book
router.post('/book', authMiddleware, meetingRoomController.bookMeetingRoom);

// @route GET /api/meeting-rooms
router.get('/', authMiddleware, meetingRoomController.getMeetingRooms);

module.exports = router;
