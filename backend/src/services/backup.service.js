const backupRepository = require('../repositories/backup.repository');

const getAllBackups = async (page = 1, limit = 10) => {
    return await backupRepository.getAllBackups(page, limit);
};

const getBackupStats = async () => {
    return await backupRepository.getBackupStats();
};

const getBackupById = async (id) => {
    return await backupRepository.getBackupById(id);
};

const createBackup = async (backupData) => {
    return await backupRepository.createBackup(backupData);
};

const deleteBackup = async (id) => {
    return await backupRepository.deleteBackup(id);
};

module.exports = {
    getAllBackups,
    getBackupStats,
    getBackupById,
    createBackup,
    deleteBackup
};
