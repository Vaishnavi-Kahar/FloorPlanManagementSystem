const FloorPlan = require('../models/FloorPlan');

const floorPlanController = {
  addFloorPlan: async (req, res) => {
    const { name, layout } = req.body;
    const username = req.user.username;

    try {
      if(FloorPlan.findOne(name)){
        res.status(201).json({ message: 'Floor plan already present' });
        return;
      }
      const newFloorPlan = new FloorPlan({ name, layout, updatedBy: username });
      await newFloorPlan.save();
      res.status(201).json({ message: 'Floor plan added successfully', floorPlan: newFloorPlan });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },

  updateFloorPlan: async (req, res) => {
    const { id } = req.params;
    const { name, layout } = req.body;
    const username = req.user.username;

    try {
      const floorPlan = await FloorPlan.findById(id);
      if (!floorPlan) {
        return res.status(404).json({ message: 'Floor plan not found' });
      }

      // Save the current state to versions history
      floorPlan.versions.push({
        name: floorPlan.name,
        layout: floorPlan.layout,
        updatedBy: floorPlan.updatedBy,
        updatedAt: floorPlan.updatedAt,
      });

      // Update the floor plan with new data
      floorPlan.name = name || floorPlan.name;
      floorPlan.layout = layout || floorPlan.layout;
      floorPlan.updatedBy = username;
      floorPlan.version += 1;
      floorPlan.updatedAt = Date.now();

      await floorPlan.save();
      res.status(200).json({ message: 'Floor plan updated successfully', floorPlan });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },

  deleteFloorPlan: async (req, res) => {
    const { id } = req.params;

    try {
      const floorPlan = await FloorPlan.findByIdAndDelete(id);
      if (!floorPlan) {
        return res.status(404).json({ message: 'Floor plan not found' });
      }

      res.status(200).json({ message: 'Floor plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },

  getFloorPlans: async (req, res) => {
    try {
      const floorPlans = await FloorPlan.find();
      res.status(200).json({ floorPlans });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },

  getFloorPlanVersions: async (req, res) => {
    const { id } = req.params;
    
    try {
      const floorPlan = await FloorPlan.findById(id);
      if (!floorPlan) {
        return res.status(404).json({ message: 'Floor plan not found' });
      }

      // Prepare the response to include the current version and previous versions
      const response = {
        currentVersion: {
          name: floorPlan.name,
          layout: floorPlan.layout,
          updatedBy: floorPlan.updatedBy,
          updatedAt: floorPlan.updatedAt,
          version: floorPlan.version,
        },
        previousVersions: floorPlan.versions,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  }
};

module.exports = floorPlanController;
