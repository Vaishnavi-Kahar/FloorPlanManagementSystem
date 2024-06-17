const express = require('express');
const router = express.Router();
const meetingRoomController = require('../controllers/meetingRoomController');

router.post('/add', meetingRoomController.addMeetingRoom);
router.post('/suggest', meetingRoomController.suggestMeetingRoom);
router.post('/book', meetingRoomController.bookMeetingRoom);
router.get('/bookings', meetingRoomController.getBookings);

module.exports = router;
