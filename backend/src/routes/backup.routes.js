const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const backupController = require('../controllers/backup.controller')
const router = express.Router();

/**
 * @swagger
 * /api/backups/test:
 *   get:
 *     summary: Health check for backup router
 *     tags: [Backups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup router is working
 */
router.get('/test',(req,res)=>{
 res.json({message:"Backup router is working."})
})

/**
 * @swagger
 * /api/backups/stats:
 *   get:
 *     summary: Get backup statistics (admin only)
 *     tags: [Backups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup stats
 */
router.get('/stats', authMiddleware, roleMiddleware('admin'), backupController.getBackupStats);

/**
 * @swagger
 * /api/backups:
 *   get:
 *     summary: Get all backups (admin only)
 *     tags: [Backups]
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
 *     responses:
 *       200:
 *         description: Paginated list of backups
 */
router.get('/', authMiddleware, roleMiddleware('admin'), backupController.getAllBackups);

/**
 * @swagger
 * /api/backups/batch-delete:
 *   post:
 *     summary: Delete multiple backups (admin only)
 *     tags: [Backups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Backups deleted
 *       400:
 *         description: Invalid ids
 */
router.post('/batch-delete', authMiddleware, roleMiddleware('admin'), backupController.deleteBatch);

/**
 * @swagger
 * /api/backups/{id}:
 *   get:
 *     summary: Get a backup by ID (admin only)
 *     tags: [Backups]
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
 *         description: Backup data
 *       404:
 *         description: Backup not found
 */
router.get('/:id', authMiddleware, roleMiddleware('admin'), backupController.getBackupById);

/**
 * @swagger
 * /api/backups:
 *   post:
 *     summary: Create a new backup record (admin only)
 *     tags: [Backups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BackupInput'
 *     responses:
 *       201:
 *         description: Backup record created
 */
router.post('/', authMiddleware, roleMiddleware('admin'), backupController.createBackup);

/**
 * @swagger
 * /api/backups/{id}/download:
 *   get:
 *     summary: Download a backup file (admin only)
 *     tags: [Backups]
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
 *         description: Backup file download
 */
router.get('/:id/download', authMiddleware, roleMiddleware('admin'), backupController.downloadBackup);

/**
 * @swagger
 * /api/backups/{id}:
 *   delete:
 *     summary: Delete a backup (admin only)
 *     tags: [Backups]
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
 *         description: Backup deleted
 *       404:
 *         description: Backup not found
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), backupController.deleteBackup);

module.exports = router;
