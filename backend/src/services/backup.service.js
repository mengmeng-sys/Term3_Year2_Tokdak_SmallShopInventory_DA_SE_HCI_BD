const backupRepository = require('../repositories/backup.repository');

const getAllBackups = async () => {
    return await backupRepository.getAllBackups();
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
    getBackupById,
    createBackup,
    deleteBackup
};