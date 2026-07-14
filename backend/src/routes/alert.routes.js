const express = require('express');
const router = express.Router();

const alertController = require('../controllers/alert.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware');

router.get('/', authMiddleware,roleMiddleware('client'),attachShop,alertController.getActiveAlerts);
router.get('/admin/count', authMiddleware,roleMiddleware('admin'),alertController.getAdminAlertCount);
router.get('/admin/notifications', authMiddleware,roleMiddleware('admin'),alertController.getAdminNotifications);
router.patch('/:id/resolve', authMiddleware,roleMiddleware('client'),attachShop,alertController.resolveAlert);

module.exports = router;