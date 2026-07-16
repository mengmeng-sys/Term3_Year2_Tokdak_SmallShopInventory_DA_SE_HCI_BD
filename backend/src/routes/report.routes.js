const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get report summary for the shop
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary report data
 */
router.get('/summary', authMiddleware, roleMiddleware('client'),attachShop, reportController.getSummary);

/**
 * @swagger
 * /api/reports/history:
 *   get:
 *     summary: Get transaction history with filters
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [restock, sale]
 *         description: Filter by transaction type
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filter by product
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Transaction history
 */
router.get('/history', authMiddleware, roleMiddleware('client'),attachShop,reportController.getHistory);

/**
 * @swagger
 * /api/reports/most-restocked:
 *   get:
 *     summary: Get most restocked products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most restocked products
 */
router.get('/most-restocked', authMiddleware, roleMiddleware('client'),attachShop,reportController.getMostRestocked);

/**
 * @swagger
 * /api/reports/most-sold:
 *   get:
 *     summary: Get most sold products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most sold products
 */
router.get('/most-sold', authMiddleware, roleMiddleware('client'),attachShop, reportController.getMostSold);

module.exports = router;
