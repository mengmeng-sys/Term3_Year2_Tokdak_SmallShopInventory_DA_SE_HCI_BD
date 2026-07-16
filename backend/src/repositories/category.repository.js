const pool = require('../config/db');

const create = async (shopId, name, description) => {
    const [result] = await pool.query(
        `INSERT INTO categories (shop_id, name, description)
         VALUES (?, ?, ?)`,
        [shopId, name, description || null]
    );

    return result;
};

const findAllByShop = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT c.*,
                COUNT(p.product_id) AS product_count
         FROM categories c
         LEFT JOIN products p ON c.category_id = p.category_id
         WHERE c.shop_id = ?
         GROUP BY c.category_id`,
        [shopId]
    );

    return rows;
};

const findById = async (categoryId, shopId) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM categories
         WHERE category_id = ?
         AND shop_id = ?`,
        [categoryId, shopId]
    );

    return rows[0];
};

const update = async (categoryId, shopId, name, description) => {
    const [result] = await pool.query(
        `UPDATE categories
         SET name = ?, description = ?
         WHERE category_id = ?
         AND shop_id = ?`,
        [name, description || null, categoryId, shopId]
    );

    return result;
};

const remove = async (categoryId, shopId) => {
    const [result] = await pool.query(
        `DELETE FROM categories
         WHERE category_id = ?
         AND shop_id = ?`,
        [categoryId, shopId]
    );

    return result;
};

module.exports = {
    create,
    findAllByShop,
    findById,
    update,
    remove
};