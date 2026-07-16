const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const productControllers = require('../controllers/product.controller');
const attachShop = require('../middlewares/attachShop.middleware');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const router = express.Router();

/**
 * @swagger
 * /api/products/test:
 *   get:
 *     summary: Health check for product router
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product router is working
 */
router.get('/test',(req,res)=>{
 res.json({message:"Product router is working."})
})

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products for the current shop
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [quantity_asc, quantity_desc]
 *         description: Sort by quantity
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/',authMiddleware,attachShop,roleMiddleware('client'),productControllers.getAll);

/**
 * @swagger
 * /api/products/export:
 *   get:
 *     summary: Export products as CSV
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export',authMiddleware,attachShop,roleMiddleware('client'),productControllers.exportProducts);

/**
 * @swagger
 * /api/products/import:
 *   post:
 *     summary: Import products from CSV file
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Products imported successfully
 */
router.post('/import', authMiddleware,attachShop,roleMiddleware('client'),upload.single('file'),productControllers.importProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
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
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.getById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.update);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/',authMiddleware,attachShop,roleMiddleware('client'),productControllers.create);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.remove);

module.exports = router;
