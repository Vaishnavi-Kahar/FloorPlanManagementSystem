const mongoose = require('mongoose');
const FloorPlan = require('../models/FloorPlan');

// Function to create a new version of a floor plan
exports.createNewVersion = async (floorPlanId, newLayout, userId) => {
  const floorPlan = await FloorPlan.findById(floorPlanId);
  if (!floorPlan) throw new Error('Floor plan not found');

  const newVersion = {
    ...floorPlan._doc,
    layout: newLayout,
    version: floorPlan.version + 1,
    updatedBy: userId,
  };

  const newFloorPlan = new FloorPlan(newVersion);
  await newFloorPlan.save();

  return newFloorPlan;
};

// Function to get the latest version of a floor plan
exports.getLatestVersion = async (floorPlanId) => {
  const floorPlan = await FloorPlan.findOne({ _id: floorPlanId }).sort({ version: -1 });
  return floorPlan;
};

// Function to rollback to a specific version
exports.rollbackToVersion = async (floorPlanId, version) => {
  const floorPlan = await FloorPlan.findOne({ _id: floorPlanId, version });
  if (!floorPlan) throw new Error('Version not found');

  const rolledBackFloorPlan = new FloorPlan({
    ...floorPlan._doc,
    version: version + 1,
  });

  await rolledBackFloorPlan.save();
  return rolledBackFloorPlan;
};
