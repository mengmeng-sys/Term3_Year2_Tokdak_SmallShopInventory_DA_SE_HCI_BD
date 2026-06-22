const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const attachShop = require('../middlewares/attachShop.middleware')

router.get('/summary', authMiddleware, roleMiddleware('client'),attachShop, reportController.getSummary);
router.get('/history', authMiddleware, roleMiddleware('client'),attachShop,reportController.getHistory);
router.get('/most-restocked', authMiddleware, roleMiddleware('client'),attachShop,reportController.getMostRestocked);
router.get('/most-sold', authMiddleware, roleMiddleware('client'),attachShop, reportController.getMostSold);

module.exports = router;