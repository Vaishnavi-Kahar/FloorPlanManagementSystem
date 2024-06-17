const mongoose = require('mongoose');

const MeetingRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  lastBooked: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('MeetingRoom', MeetingRoomSchema);
