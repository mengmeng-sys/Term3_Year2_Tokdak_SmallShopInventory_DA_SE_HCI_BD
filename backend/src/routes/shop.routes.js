const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/shops/test:
 *   get:
 *     summary: Health check for shop router
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop router is working
 */
router.get('/test',(req,res)=>{
 res.json({message:"Shop router is working."})
})

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all shops (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of shops
 */
router.get('/', authMiddleware, roleMiddleware('admin'), shopController.getAllShops);

/**
 * @swagger
 * /api/shops/stats:
 *   get:
 *     summary: Get shop statistics (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop stats
 */
router.get('/stats', authMiddleware, roleMiddleware('admin'), shopController.getShopListStats);

/**
 * @swagger
 * /api/shops/user/{userId}:
 *   get:
 *     summary: Get shop by user ID
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shop data
 */
router.get('/user/:userId', authMiddleware, shopController.getShopByUserId);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Shops]
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
 *         description: Shop data
 *       404:
 *         description: Shop not found
 */
router.get('/:id', authMiddleware, shopController.getShopById);

/**
 * @swagger
 * /api/shops/{id}/details:
 *   get:
 *     summary: Get detailed shop info with summary counts (admin only)
 *     tags: [Shops]
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
 *         description: Shop details
 */
router.get('/:id/details', authMiddleware, roleMiddleware('admin'), shopController.getShopDetails);

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Update a shop
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopInput'
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authMiddleware, shopController.updateShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete a shop
 *     tags: [Shops]
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
 *         description: Shop deleted successfully
 *       400:
 *         description: Cannot delete shop with active data
 */
router.delete('/:id', authMiddleware, shopController.deleteShop);

module.exports = router;
