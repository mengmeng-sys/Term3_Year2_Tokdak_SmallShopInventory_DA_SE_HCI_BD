const express = require('express');
const router = express.Router();
const shopSettingsController = require('../controllers/shop_settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')

router.get('/', authMiddleware, roleMiddleware('client'),attachShop, shopSettingsController.getSettings);
router.put('/', authMiddleware, roleMiddleware('client'), attachShop,shopSettingsController.updateSettings);

module.exports = router;