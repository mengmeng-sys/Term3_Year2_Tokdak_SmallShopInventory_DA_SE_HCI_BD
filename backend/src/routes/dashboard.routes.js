const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware');

router.get('/client',authMiddleware,roleMiddleware('client'),attachShop,dashboardController.getClientDashboard);
router.get('/admin',authMiddleware,roleMiddleware('admin'),dashboardController.getAdminDashboard);

module.exports = router;