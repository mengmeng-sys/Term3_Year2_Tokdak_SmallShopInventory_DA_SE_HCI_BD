const express = require('express');
const router = express.Router();
const shopSettingsController = require('../controllers/shop_settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')

/**
 * @swagger
 * /api/shop-settings:
 *   get:
 *     summary: Get shop settings
 *     tags: [Shop Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop settings data
 */
router.get('/', authMiddleware, roleMiddleware('client'),attachShop, shopSettingsController.getSettings);

/**
 * @swagger
 * /api/shop-settings:
 *   put:
 *     summary: Update shop settings
 *     tags: [Shop Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SettingsInput'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/', authMiddleware, roleMiddleware('client'), attachShop,shopSettingsController.updateSettings);

module.exports = router;
