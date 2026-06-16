const pool = require('../config/db')

const findByEmail = async (email) =>{
 const [rows] = await pool.query(
  'select * from users where email = ?',
  [email]);

 return rows[0];
}

const findEmailExists = async (email) => {
    const [rows] = await pool.query(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
    );
    return rows.length > 0;
};

const createUserWithShop = async (userData, shopData) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [userResult] = await connection.query(
            `INSERT INTO users (name, email, password, role, DOB, gender)
             VALUES (?, ?, ?, 'client', ?, ?)`,
            [userData.name, userData.email, userData.password, userData.DOB, userData.gender]
        );

        const newUserId = userResult.insertId;

        const [shopResult] = await connection.query(
            `INSERT INTO shops (user_id, shop_name, address, phone)
             VALUES (?, ?, ?, ?)`,
            [newUserId, shopData.shop_name, shopData.address, shopData.phone]
        );

        await connection.commit();

        return {
            user_id: newUserId,
            shop_id: shopResult.insertId
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const findById = async (userId) => {
    const [rows] = await pool.query(
        'select user_id, name, email, role, DOB, gender, created_at from users where user_id = ?',
        [userId]
    );
    return rows[0];
}

module.exports = {
    findByEmail,
    findEmailExists,
    createUserWithShop,
    findById
};
