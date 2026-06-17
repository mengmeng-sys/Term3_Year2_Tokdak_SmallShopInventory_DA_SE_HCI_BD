const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const router = express.Router();
router.get('/',(req,res)=>{
 res.json({message:'Auth router is working.'})
})
router.post('/login',authController.login);
router.post('/register',authMiddleware,roleMiddleware('admin'),authController.register);
router.get('/me',authMiddleware,authController.getMe);
router.put('/change-password',authMiddleware,authController.changePassword);
router.post('/forgot-password',authController.forgotPassword);
router.post('/reset-password-otp',authController.resetPasswordWithOtp);
module.exports = router;