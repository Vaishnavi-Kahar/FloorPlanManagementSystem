const mongoose = require('mongoose');

const FloorPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('FloorPlan', FloorPlanSchema);
