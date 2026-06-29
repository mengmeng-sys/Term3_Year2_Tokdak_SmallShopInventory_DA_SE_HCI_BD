const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
router.get('/test',(req,res)=>{
 res.json({message:"Shop router is working."})
})
router.get('/', authMiddleware, roleMiddleware('admin'), shopController.getAllShops);
router.get('/stats', authMiddleware, roleMiddleware('admin'), shopController.getShopListStats);
router.get('/:id', authMiddleware, shopController.getShopById);
router.get('/:id/details', authMiddleware, roleMiddleware('admin'), shopController.getShopDetails);
router.put('/:id', authMiddleware, shopController.updateShop);
router.delete('/:id', authMiddleware, shopController.deleteShop);

module.exports = router;