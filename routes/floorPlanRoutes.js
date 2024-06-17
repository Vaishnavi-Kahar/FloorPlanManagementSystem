const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const floorPlanController = require('../controllers/floorPlanController');

router.post('/add', authMiddleware, floorPlanController.addFloorPlan);
router.put('/update/:id', authMiddleware, floorPlanController.updateFloorPlan);
router.delete('/delete/:id', authMiddleware, floorPlanController.deleteFloorPlan);
router.get('/get', authMiddleware, floorPlanController.getFloorPlans);
router.get('/get/:id/versions', authMiddleware, floorPlanController.getFloorPlanVersions);

module.exports = router;
