const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')


// NOTE: If you are using an attachShop middleware, add it here after authMiddleware.
// If your project instead derives shop from req.user.shop_id (set at login) or
// looks it up directly inside the controller/service, adjust accordingly.
// const attachShop = require('../middlewares/attachShop.middleware');

router.post('/restock', authMiddleware,attachShop,roleMiddleware('client'), stockController.restock);
router.post('/sale', authMiddleware,attachShop,roleMiddleware('client'), stockController.recordSale);
router.get('/low-stock', authMiddleware,attachShop, roleMiddleware('client'), stockController.getLowStock);
router.get('/history', authMiddleware,attachShop, roleMiddleware('client'), stockController.getShopHistory);
router.get('/history/:productId', authMiddleware,attachShop,roleMiddleware('client'), stockController.getProductHistory);

module.exports = router;
