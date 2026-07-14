const backupService = require('../services/backup.service');

const getAllBackups = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await backupService.getAllBackups(page, limit);

        res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
};

const getBackupStats = async (req, res, next) => {
    try {
        const stats = await backupService.getBackupStats();

        res.status(200).json({ data: stats });
    } catch (error) {
        next(error);
    }
};

const getBackupById = async (req, res, next) => {
    try {
        const backup = await backupService.getBackupById(
            req.params.id
        );

        if (!backup) {
            return res.status(404).json({
                message: 'Backup not found'
            });
        }

        res.status(200).json(backup);
    } catch (error) {
        next(error);
    }
};

const createBackup = async (req, res, next) => {
    try {
        const backupId = await backupService.createBackup(
            req.body
        );

        res.status(201).json({
            message: 'Backup record created',
            backupId
        });
    } catch (error) {
        next(error);
    }
};

const downloadBackup = async (req, res, next) => {
    try {
        const result = await backupService.getBackupFilePath(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Backup not found' });
        }
        const { backup, filePath } = result;
        res.download(filePath, backup.file_name);
    } catch (error) {
        next(error);
    }
};

const deleteBackup = async (req, res, next) => {
    try {
        const result = await backupService.deleteBackup(
            req.params.id
        );

        if (!result) {
            return res.status(404).json({
                message: 'Backup not found'
            });
        }

        res.status(200).json({
            message: 'Backup deleted'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBackups,
    getBackupStats,
    getBackupById,
    createBackup,
    downloadBackup,
    deleteBackup
};
