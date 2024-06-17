const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  meetingRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'MeetingRoom', required: true },
  bookedBy: { type: String, required: true },
  participants: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
