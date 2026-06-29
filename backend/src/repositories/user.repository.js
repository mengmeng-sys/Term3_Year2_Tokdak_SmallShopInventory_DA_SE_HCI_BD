const pool = require('../config/db')

const allUser = async (page = 1, limit = 10, search = '', status = '') => {
    const offset = (page - 1) * limit;
    const conditions = ["u.role != 'admin'"];
    const params = [];

    if (search) {
        conditions.push('(u.name LIKE ? OR u.email LIKE ?)');
        const pattern = `%${search}%`;
        params.push(pattern, pattern);
    }
    if (status === 'active') {
        conditions.push('u.is_active = TRUE');
    } else if (status === 'inactive') {
        conditions.push('u.is_active = FALSE');
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await pool.query(
        `SELECT u.user_id, u.name, u.email, u.role, u.is_active, u.created_at
         FROM users u
         ${where}
         ORDER BY u.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    const [countResult] = await pool.query(
        `SELECT COUNT(*) AS count FROM users u ${where}`,
        params
    );
    const total = countResult[0].count;

    return { rows, total };
}

const findById = async (userId) => {
    const [rows] = await pool.query(
        'SELECT user_id, name, email, DOB, gender, role, is_active, created_at from users WHERE user_id = ?',
        [userId]
    )
    return rows[0]
}

const updateUser = async (userId, updateData) => {
    const {name, email, DOB, gender } = updateData;

    const [result] = await pool.query(
        "UPDATE users set name = ?, email = ?, DOB = ?, gender = ? WHERE user_id = ?",
        [name, email, DOB, gender, userId]
    )
    return result;
}

const removeUser = async (userId) => {
    const [result] = await pool.query(
        "DELETE FROM users WHERE user_id = ? and role != 'admin'",
        [userId]
    );

    return result;
}

const updateUserStatus = async (userId, isActive) => {
    const [result] = await pool.query(
        'UPDATE users SET is_active = ? WHERE user_id = ?',
        [isActive, userId]
    );
    return result;
}

module.exports = {
    allUser,
    findById,
    updateUser,
    removeUser,
    updateUserStatus
};
