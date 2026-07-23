const pool = require('../config/db');

const getAllBackups = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(`
        SELECT b.*, s.shop_name
        FROM backups b
        JOIN shops s ON b.shop_id = s.shop_id
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [[{ count }]] = await pool.query(
        'SELECT COUNT(*) AS count FROM backups'
    );

    return { rows, total: count };
};

const getBackupStats = async () => {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM backups');

    const [[{ success_count }]] = await pool.query(
        "SELECT COUNT(*) AS success_count FROM backups WHERE status = 'success'"
    );

    const [[{ failed_24h }]] = await pool.query(
        "SELECT COUNT(*) AS failed_24h FROM backups WHERE status = 'failed' AND created_at >= NOW() - INTERVAL 24 HOUR"
    );

    const [[{ total_storage }]] = await pool.query(
        'SELECT COALESCE(SUM(file_size), 0) AS total_storage FROM backups'
    );

    return { total, success_count, failed_24h, total_storage };
};

const getBackupById = async (backupId) => {
    const [rows] = await pool.query(
        `SELECT b.*, s.shop_name
         FROM backups b
         JOIN shops s ON b.shop_id = s.shop_id
         WHERE b.backup_id = ?`,
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

const deleteBatch = async (ids) => {
    if (!ids.length) return 0;
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(
        `DELETE FROM backups WHERE backup_id IN (${placeholders})`,
        ids
    );
    return result.affectedRows;
};

module.exports = {
    getAllBackups,
    getBackupStats,
    getBackupById,
    createBackup,
    deleteBackup,
    deleteBatch
};
