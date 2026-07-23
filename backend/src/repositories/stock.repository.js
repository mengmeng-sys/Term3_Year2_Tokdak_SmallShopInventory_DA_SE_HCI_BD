const pool = require('../config/db');

const createTransaction = async (transactionData) => {
    const {
        product_id,
        user_id,
        type,
        quantity_changed,
        quantity_before,
        quantity_after,
        note
    } = transactionData;

    const [result] = await pool.query(
        `INSERT INTO stock_transactions 
        (product_id, user_id, type, quantity_changed, quantity_before, quantity_after, note)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product_id, user_id, type, quantity_changed, quantity_before, quantity_after, note]
    );
    return result.insertId;
};

const findByProduct = async (productId, shopId) => {
    const [rows] = await pool.query(
        `SELECT st.*, p.name AS product_name
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE st.product_id = ? AND p.shop_id = ?
         ORDER BY st.created_at DESC`,
        [productId, shopId]
    );
    return rows;
};

const findAllByShop = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT st.*, p.name AS product_name
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ?
         ORDER BY st.created_at DESC`,
        [shopId]
    );
    return rows;
};

const findLowStock = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT p.*, c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.category_id
         WHERE p.shop_id = ? AND p.current_quantity < p.min_quantity AND p.current_quantity > 0
         ORDER BY p.current_quantity ASC`,
        [shopId]
    );
    return rows;
};

module.exports = {
    createTransaction,
    findByProduct,
    findAllByShop,
    findLowStock
};
