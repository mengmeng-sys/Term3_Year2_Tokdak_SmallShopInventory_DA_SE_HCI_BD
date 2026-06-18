const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');
router.get('/test',(req,res)=>{
 res.json({message:"category router is working."})
})
router.post(
    '/',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.create
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.getAll
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.getById
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.update
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.remove
);

module.exports = router;