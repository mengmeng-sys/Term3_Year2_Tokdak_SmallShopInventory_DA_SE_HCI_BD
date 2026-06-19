const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // max 3 requests per 15 minutes per IP
    message: { message: 'Too many password reset attempts. Please try again in 15 minutes.' }
});
router.get('/test',(req,res)=>{
 res.json({message:'Auth router is working.'})
})
router.post(
    '/login',
    authController.login
);
router.post(
    '/register',
    authMiddleware,
    roleMiddleware('admin'),
    authController.register);
router.post(
    '/verify-registration',
    authMiddleware,
    roleMiddleware('admin'),
    authController.verifyRegistration
);
router.get(
    '/me',
    authMiddleware,
    authController.getMe
);
router.put(
    '/change-password',
    authMiddleware,
    authController.changePassword
);
router.post(
    '/forgot-password', 
    otpLimiter,
     authController.forgotPassword
    );
router.post(
    '/reset-password-otp',
    authController.resetPasswordWithOtp
)
module.exports = router;