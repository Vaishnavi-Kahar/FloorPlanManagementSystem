const express = require('express');
const router = express.Router();
const floorPlanController = require('../controllers/floorPlanController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require('../middlewares/cacheMiddleware');

// @route POST /api/floor-plans
router.post('/', authMiddleware, floorPlanController.uploadFloorPlan);

// @route GET /api/floor-plans
router.get('/', authMiddleware, cacheMiddleware, floorPlanController.getFloorPlans);

module.exports = router;
