const express = require('express');
const router = express.Router();

const alertController = require('../controllers/alert.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware');

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get active alerts for the current shop
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active alerts
 */
router.get('/', authMiddleware,roleMiddleware('client'),attachShop,alertController.getActiveAlerts);

/**
 * @swagger
 * /api/alerts/admin/count:
 *   get:
 *     summary: Get total alert count across all shops (admin only)
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alert count
 */
router.get('/admin/count', authMiddleware,roleMiddleware('admin'),alertController.getAdminAlertCount);

/**
 * @swagger
 * /api/alerts/admin/notifications:
 *   get:
 *     summary: Get all notifications for admin
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin notifications
 */
router.get('/admin/notifications', authMiddleware,roleMiddleware('admin'),alertController.getAdminNotifications);

/**
 * @swagger
 * /api/alerts/{id}/resolve:
 *   patch:
 *     summary: Resolve an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alert resolved
 */
router.patch('/:id/resolve', authMiddleware,roleMiddleware('client'),attachShop,alertController.resolveAlert);

module.exports = router;
