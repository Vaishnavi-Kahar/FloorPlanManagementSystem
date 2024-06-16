const MeetingRoom = require('../models/MeetingRoom');
const { recommendRoom } = require('../utils/recommendationSystem');

exports.bookMeetingRoom = async ({ participants, requirements, userId }) => {
  const room = await recommendRoom(participants, requirements);

  if (!room) throw new Error('No suitable meeting room available');

  room.booked = true;
  room.bookedBy = userId;
  room.bookedAt = new Date();

  await room.save();
  return room;
};

exports.getMeetingRooms = async () => {
  return await MeetingRoom.find();
};
