const FloorPlan = require('../models/FloorPlan');
const { resolveConflicts, trackChanges, mergeChanges } = require('../utils/conflictResolution');
const { createNewVersion, getLatestVersion } = require('../utils/versionControl');
const { saveOfflineUpdate, syncUpdates } = require('../utils/offlineSync');

exports.uploadFloorPlan = async ({ name, layout, userId, isOffline }) => {
  if (isOffline) {
    await saveOfflineUpdate({ name, layout, userId });
    return { msg: 'Changes saved offline. Will sync when back online.' };
  }

  await syncUpdates();

  const existingFloorPlan = await FloorPlan.findOne({ name });

  if (existingFloorPlan) {
    const resolvedLayout = resolveConflicts(existingFloorPlan.layout, layout);
    const newFloorPlan = await createNewVersion(existingFloorPlan._id, resolvedLayout, userId);
    await trackChanges(newFloorPlan);
    return newFloorPlan;
  } else {
    const newFloorPlan = new FloorPlan({ name, layout, updatedBy: userId });
    await newFloorPlan.save();
    return newFloorPlan;
  }
};

exports.getFloorPlans = async () => {
  return await FloorPlan.find();
};
