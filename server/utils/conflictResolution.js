const mongoose = require('mongoose');
const FloorPlan = require('../models/FloorPlan');

// Function to resolve conflicts based on priority and timestamps
exports.resolveConflicts = (existingLayout, newLayout) => {
  const resolvedLayout = { ...existingLayout };

  // Iterate over each room/seat in the new layout and resolve conflicts
  for (const [key, value] of Object.entries(newLayout)) {
    if (existingLayout[key]) {
      // Compare timestamps and resolve conflict
      if (value.timestamp > existingLayout[key].timestamp) {
        resolvedLayout[key] = value;
      }
    } else {
      resolvedLayout[key] = value;
    }
  }

  return resolvedLayout;
};

// Function to track changes (for version control)
exports.trackChanges = async (floorPlan) => {
  const changeLog = new mongoose.Schema({
    floorPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FloorPlan',
      required: true,
    },
    changes: {
      type: Object,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

  const ChangeLog = mongoose.model('ChangeLog', changeLog);
  await ChangeLog.create({
    floorPlanId: floorPlan._id,
    changes: floorPlan.layout,
  });
};

// Function to merge changes from multiple sources
exports.mergeChanges = (layouts) => {
  return layouts.reduce((merged, layout) => {
    return this.resolveConflicts(merged, layout);
  }, {});
};
