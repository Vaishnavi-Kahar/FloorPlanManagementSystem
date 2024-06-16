const FloorPlan = require('../models/FloorPlan');
const { resolveConflicts, trackChanges, mergeChanges } = require('../utils/conflictResolution');

exports.uploadFloorPlan = async (req, res) => {
  const { name, layout } = req.body;
  const userId = req.user.id;

  try {
    const existingFloorPlan = await FloorPlan.findOne({ name });
    if (existingFloorPlan) {
      const resolvedLayout = resolveConflicts(existingFloorPlan.layout, layout);
      const updatedFloorPlan = await FloorPlan.findOneAndUpdate(
        { name },
        {
          layout: resolvedLayout,
          version: existingFloorPlan.version + 1,
          updatedBy: userId,
        },
        { new: true }
      );

      await trackChanges(updatedFloorPlan);
      res.json(updatedFloorPlan);
    } else {
      const newFloorPlan = new FloorPlan({ name, layout, updatedBy: userId });
      await newFloorPlan.save();
      res.json(newFloorPlan);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.find();
    res.json(floorPlans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
