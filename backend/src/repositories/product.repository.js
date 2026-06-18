const pool = require('../config/db');

const create = async (productData) => {
    const {
        shop_id,
        category_id,
        name,
        description,
        price,
        current_quantity,
        min_quantity,
        unit
    } = productData;

    const [result] = await pool.query(
        `INSERT INTO products
        (
            shop_id,
            category_id,
            name,
            description,
            price,
            current_quantity,
            min_quantity,
            unit
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            shop_id,
            category_id,
            name,
            description,
            price,
            current_quantity,
            min_quantity,
            unit
        ]
    );

    return result;
};

const findAllByShop = async (shopId, filters = {}) => {
    let sql = `
        SELECT p.*, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.shop_id = ?
    `;
    const params = [shopId];

    // Search by name
    if (filters.search) {
        sql += ' AND p.name LIKE ?';
        params.push(`%${filters.search}%`);
    }

    // Filter by category
    if (filters.category_id) {
        sql += ' AND p.category_id = ?';
        params.push(filters.category_id);
    }

    // Sort by quantity (highest or lowest)
    if (filters.sort === 'quantity_asc') {
        sql += ' ORDER BY p.current_quantity ASC';
    } else if (filters.sort === 'quantity_desc') {
        sql += ' ORDER BY p.current_quantity DESC';
    } else {
        sql += ' ORDER BY p.created_at DESC';
    }

    const [rows] = await pool.query(sql, params);
    return rows;
};

const findById = async (productId, shopId) => {
    const [rows] = await pool.query(
        `SELECT
            p.*,
            c.name AS category_name
        FROM products p
        JOIN categories c
            ON p.category_id = c.category_id
        WHERE p.product_id = ?
        AND p.shop_id = ?`,
        [productId, shopId]
    );

    return rows[0];
};

const update = async (productId, shopId, productData) => {
    const {
        category_id,
        name,
        description,
        price,
        current_quantity,
        min_quantity,
        unit
    } = productData;

    const [result] = await pool.query(
        `UPDATE products
         SET
            category_id = ?,
            name = ?,
            description = ?,
            price = ?,
            current_quantity = ?,
            min_quantity = ?,
            unit = ?
         WHERE product_id = ?
         AND shop_id = ?`,
        [
            category_id,
            name,
            description,
            price,
            current_quantity,
            min_quantity,
            unit,
            productId,
            shopId
        ]
    );

    return result;
};

const remove = async (productId, shopId) => {
    const [result] = await pool.query(
        `DELETE FROM products
         WHERE product_id = ?
         AND shop_id = ?`,
        [productId, shopId]
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