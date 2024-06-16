const mongoose = require('mongoose');

const MeetingRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('MeetingRoom', MeetingRoomSchema);
