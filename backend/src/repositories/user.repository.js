const pool = require('../config/db')

const allUser = async () => {
    const [rows] = await pool.query(
        'SELECT user_id, name, email, DOB, gender, created_at from users'
    )
    return rows;
}

const findById = async (userId) => {
    const [rows] = await pool.query(
        'SELECT user_id, name, email, DOB, gender, created_at from users WHERE user_id = ?',
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

module.exports = {
    allUser,
    findById,
    updateUser,
    removeUser
};