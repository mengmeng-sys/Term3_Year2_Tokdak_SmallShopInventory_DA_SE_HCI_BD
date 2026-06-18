const pool = require('../config/db');

const create = async (shopId, name) => {
    const [result] = await pool.query(
        `INSERT INTO categories (shop_id, name)
         VALUES (?, ?)`,
        [shopId, name]
    );

    return result;
};

const findAllByShop = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM categories
         WHERE shop_id = ?`,
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

const update = async (categoryId, shopId, name) => {
    const [result] = await pool.query(
        `UPDATE categories
         SET name = ?
         WHERE category_id = ?
         AND shop_id = ?`,
        [name, categoryId, shopId]
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