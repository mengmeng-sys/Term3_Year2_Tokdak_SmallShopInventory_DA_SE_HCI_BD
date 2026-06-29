const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const backupController = require('../controllers/backup.controller')
const router = express.Router();
router.get('/test',(req,res)=>{
 res.json({message:"Backup router is working."})
})
router.get('/stats', authMiddleware, roleMiddleware('admin'), backupController.getBackupStats);
router.get('/', authMiddleware, roleMiddleware('admin'), backupController.getAllBackups);
router.get('/:id', authMiddleware, roleMiddleware('admin'), backupController.getBackupById);
router.post('/', authMiddleware, roleMiddleware('admin'), backupController.createBackup);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), backupController.deleteBackup);
module.exports = router;
