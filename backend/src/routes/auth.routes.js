const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { message: 'Too many password reset attempts. Please try again in 15 minutes.' }
});

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Health check for auth router
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Auth router is working
 */
router.get('/test', (req, res) => {
    res.json({ message: 'Auth router is working.' });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email and password are required
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user with a shop (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registration initiated, OTP sent
 *       400:
 *         description: Validation error
 */
router.post('/register', authMiddleware, roleMiddleware('admin'), authController.register);

/**
 * @swagger
 * /api/auth/verify-registration:
 *   post:
 *     summary: Verify registration with OTP (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpInput'
 *     responses:
 *       201:
 *         description: Registration verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-registration', authMiddleware, roleMiddleware('admin'), authController.verifyRegistration);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change password for authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 */
router.put('/change-password', authMiddleware, authController.changePassword);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: "Request password reset OTP (rate limited: 3 per 15 min)"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       429:
 *         description: Too many requests
 */
router.post('/forgot-password', otpLimiter, authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password-otp:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 */
router.post('/reset-password-otp', authController.resetPasswordWithOtp);

module.exports = router;
