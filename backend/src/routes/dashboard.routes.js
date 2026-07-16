const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware');

/**
 * @swagger
 * /api/dashboard/client:
 *   get:
 *     summary: Get client dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client dashboard data
 */
router.get('/client',authMiddleware,roleMiddleware('client'),attachShop,dashboardController.getClientDashboard);

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 */
router.get('/admin',authMiddleware,roleMiddleware('admin'),dashboardController.getAdminDashboard);

module.exports = router;
