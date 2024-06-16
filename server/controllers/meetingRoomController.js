const MeetingRoom = require('../models/MeetingRoom');
const { recommendRoom } = require('../utils/recommendationSystem');

exports.bookMeetingRoom = async (req, res) => {
  const { participants, requirements } = req.body;
  const userId = req.user.id;

  try {
    const room = await recommendRoom(participants, requirements);

    if (!room) {
      return res.status(400).json({ msg: 'No suitable meeting room available' });
    }

    room.booked = true;
    room.bookedBy = userId;
    room.bookedAt = new Date();

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMeetingRooms = async (req, res) => {
  try {
    const meetingRooms = await MeetingRoom.find();
    res.json(meetingRooms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
