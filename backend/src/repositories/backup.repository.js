const pool = require('../config/db');

const getAllBackups = async () => {
    const [rows] = await pool.query(`
        SELECT *
        FROM backups
        ORDER BY created_at DESC
    `);

    return rows;
};

const getBackupById = async (backupId) => {
    const [rows] = await pool.query(
        'SELECT * FROM backups WHERE backup_id = ?',
        [backupId]
    );

    return rows[0];
};

const createBackup = async (backupData) => {
    const {
        shop_id,
        user_id,
        file_name,
        file_size,
        status,
        note
    } = backupData;

    const [result] = await pool.query(
        `INSERT INTO backups
        (shop_id, user_id, file_name, file_size, status, note)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [shop_id, user_id, file_name, file_size, status, note]
    );

    return result.insertId;
};

const deleteBackup = async (backupId) => {
    const [result] = await pool.query(
        'DELETE FROM backups WHERE backup_id = ?',
        [backupId]
    );

    return result.affectedRows;
};

module.exports = {
    getAllBackups,
    getBackupById,
    createBackup,
    deleteBackup
};