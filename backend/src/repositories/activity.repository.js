const pool = require('../config/db');

const insert = async (adminId, actionType, targetName, targetEmail, details) => {
    const [result] = await pool.query(
        `INSERT INTO admin_activity_log (admin_id, action_type, target_name, target_email, details)
         VALUES (?, ?, ?, ?, ?)`,
        [adminId, actionType, targetName, targetEmail || null, details || null]
    );
    return result.insertId;
};

const findAllRecent = async (limit = 20) => {
    const [rows] = await pool.query(
        `SELECT a.*, u.name AS admin_name
         FROM admin_activity_log a
         JOIN users u ON a.admin_id = u.user_id
         ORDER BY a.created_at DESC
         LIMIT ?`,
        [limit]
    );
    return rows;
};

const countRecent = async (hours = 24) => {
    const [[{ count }]] = await pool.query(
        `SELECT COUNT(*) AS count FROM admin_activity_log
         WHERE created_at >= NOW() - INTERVAL ? HOUR`,
        [hours]
    );
    return count;
};

module.exports = { insert, findAllRecent, countRecent };
