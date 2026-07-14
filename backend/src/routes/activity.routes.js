const express = require('express');
const router = express.Router();

const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', authMiddleware, roleMiddleware('admin'), activityController.getActivities);

module.exports = router;
