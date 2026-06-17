const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, roleMiddleware('admin'), shopController.getAllShops);
router.get('/:id', authMiddleware, shopController.getShopById);
router.put('/:id', authMiddleware, shopController.updateShop);
router.delete('/:id', authMiddleware, shopController.deleteShop);

module.exports = router;