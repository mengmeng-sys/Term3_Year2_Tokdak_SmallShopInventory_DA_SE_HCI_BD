const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/categories/test:
 *   get:
 *     summary: Health check for category router
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category router is working
 */
router.get('/test',(req,res)=>{
 res.json({message:"category router is working."})
})

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post(
    '/',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.create
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories for the current shop
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get(
    '/',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.getAll
);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
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
 *         description: Category data
 *       404:
 *         description: Category not found
 */
router.get(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.getById
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category name
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.update
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       409:
 *         description: Cannot delete category with existing products
 */
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('client'),
    categoryController.remove
);

module.exports = router;
