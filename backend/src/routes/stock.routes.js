const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')

/**
 * @swagger
 * /api/stock/restock:
 *   post:
 *     summary: Restock a product (add inventory)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockInput'
 *     responses:
 *       200:
 *         description: Product restocked successfully
 */
router.post('/restock', authMiddleware,attachShop,roleMiddleware('client'), stockController.restock);

/**
 * @swagger
 * /api/stock/sale:
 *   post:
 *     summary: Record a sale (deduct inventory)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockInput'
 *     responses:
 *       200:
 *         description: Sale recorded successfully
 *       400:
 *         description: Insufficient stock
 */
router.post('/sale', authMiddleware,attachShop,roleMiddleware('client'), stockController.recordSale);

/**
 * @swagger
 * /api/stock/low-stock:
 *   get:
 *     summary: Get products with quantity below minimum threshold
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products
 */
router.get('/low-stock', authMiddleware,attachShop, roleMiddleware('client'), stockController.getLowStock);

/**
 * @swagger
 * /api/stock/history:
 *   get:
 *     summary: Get stock transaction history for the shop
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock history
 */
router.get('/history', authMiddleware,attachShop, roleMiddleware('client'), stockController.getShopHistory);

/**
 * @swagger
 * /api/stock/history/{productId}:
 *   get:
 *     summary: Get stock transaction history for a specific product
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product stock history
 */
router.get('/history/:productId', authMiddleware,attachShop,roleMiddleware('client'), stockController.getProductHistory);

module.exports = router;
