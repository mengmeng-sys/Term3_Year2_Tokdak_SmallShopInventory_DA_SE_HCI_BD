const backupService = require('../services/backup.service');

const getAllBackups = async (req, res, next) => {
    try {
        const backups = await backupService.getAllBackups();

        res.status(200).json(backups);
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
    getBackupById,
    createBackup,
    deleteBackup
};