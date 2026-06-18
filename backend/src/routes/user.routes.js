const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
router.get('/test',(req,res)=>{
 res.json({message:"User router is working."})
})
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;