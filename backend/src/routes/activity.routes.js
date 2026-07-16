const express = require('express');
const router = express.Router();

const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Get recent activities (admin only)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activities with unread count
 */
router.get('/', authMiddleware, roleMiddleware('admin'), activityController.getActivities);

module.exports = router;
