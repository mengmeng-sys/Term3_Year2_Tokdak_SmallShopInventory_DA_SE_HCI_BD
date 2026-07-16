const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/avatars')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${req.params.id}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * @swagger
 * /api/users/test:
 *   get:
 *     summary: Health check for user router
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User router is working
 */
router.get('/test',(req,res)=>{
 res.json({message:"User router is working."})
})

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Toggle user active status (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusToggleInput'
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), userController.toggleUserStatus);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Upload user avatar image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 */
router.post('/:id/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       409:
 *         description: Cannot delete user with related data
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;
