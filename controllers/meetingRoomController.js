const MeetingRoom = require('../models/MeetingRoom');
const Booking = require('../models/Booking');

const meetingRoomController = {
  addMeetingRoom: async (req, res) => {
    const { name, capacity, location } = req.body;

    try {
      const newMeetingRoom = new MeetingRoom({ name, capacity, location });
      await newMeetingRoom.save();
      res.status(201).json({ message: 'Meeting room added successfully', meetingRoom: newMeetingRoom });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },

  suggestMeetingRoom: async (req, res) => {
    const { participants } = req.body;
  
    try {
      // Find all rooms with capacity greater than or equal to the number of participants
      const rooms = await MeetingRoom.find({ capacity: { $gte: participants } })
        .sort({ capacity: 1, lastBooked: 1 })
        .exec();
  
      if (rooms.length === 0) {
        return res.status(404).json({ message: 'No suitable meeting room found' });
      }
  
      // Suggest the room with the smallest capacity that is greater than or equal to the number of participants
      const suitableRoom = rooms[0];
  
      res.status(200).json({ message: 'Meeting room suggested', meetingRoom: suitableRoom });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  }
  ,
  

  bookMeetingRoom: async (req, res) => {
    const { roomId, bookedBy, participants, startTime, endTime } = req.body;

  try {
    const meetingRoom = await MeetingRoom.findById(roomId);
    if (!meetingRoom) {
      return res.status(404).json({ message: 'Meeting room not found' });
    }

    if (participants > meetingRoom.capacity) {
      return res.status(400).json({ message: 'Number of participants exceeds room capacity' });
    }

    const overlappingBookings = await Booking.find({
      meetingRoom: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Meeting room is already booked for the specified time slot' });
    }

    const newBooking = new Booking({ meetingRoom: roomId, bookedBy, participants, startTime, endTime });
    await newBooking.save();

    meetingRoom.lastBooked = new Date();
    await meetingRoom.save();

    res.status(201).json({ message: 'Meeting room booked successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
  },

  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate('meetingRoom').exec();
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  }
};

module.exports = meetingRoomController;
