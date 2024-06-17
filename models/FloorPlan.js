const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  name: String,
  layout: Object,
  updatedBy: String,
  updatedAt: Date,
});

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
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  versions: [versionSchema],
}, { timestamps: true });

module.exports = mongoose.model('FloorPlan', FloorPlanSchema);
