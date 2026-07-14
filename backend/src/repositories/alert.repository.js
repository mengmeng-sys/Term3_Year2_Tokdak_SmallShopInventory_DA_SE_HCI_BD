const pool = require('../config/db');

const createIfNotExists = async (productId, shopId, type) => {
    // Only create if there's no existing unresolved alert for this product
    const [existing] = await pool.query(
        `SELECT alert_id FROM alerts 
         WHERE product_id = ? AND is_resolved = FALSE`,
        [productId]
    );

    if (existing.length === 0) {
        await pool.query(
            `INSERT INTO alerts (product_id, shop_id, type, is_resolved)
             VALUES (?, ?, ?, FALSE)`,
            [productId, shopId, type]
        );
    }
};

const resolveByProduct = async (productId) => {
    await pool.query(
        `UPDATE alerts SET is_resolved = TRUE, resolved_at = NOW()
         WHERE product_id = ? AND is_resolved = FALSE`,
        [productId]
    );
};

const findAllByShop = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT a.*, p.name AS product_name, p.current_quantity, p.min_quantity
         FROM alerts a
         JOIN products p ON a.product_id = p.product_id
         WHERE a.shop_id = ? AND a.is_resolved = FALSE
         ORDER BY a.created_at DESC`,
        [shopId]
    );
    return rows;
};

const findById = async (alertId) => {
    const [rows] = await pool.query(
        'SELECT * FROM alerts WHERE alert_id = ?',
        [alertId]
    );
    return rows[0];
};

const resolveById = async (alertId) => {
    await pool.query(
        `UPDATE alerts SET is_resolved = TRUE, resolved_at = NOW()
         WHERE alert_id = ?`,
        [alertId]
    );
};

const countAllUnresolved = async () => {
    const [[{ count }]] = await pool.query(
        'SELECT COUNT(*) AS count FROM alerts WHERE is_resolved = FALSE'
    );
    return count;
};

const findAllUnresolvedWithDetails = async () => {
    const [rows] = await pool.query(
        `SELECT a.alert_id, a.type, a.created_at, a.is_resolved,
                p.name AS product_name, p.current_quantity, p.min_quantity,
                s.shop_id, s.shop_name
         FROM alerts a
         JOIN products p ON a.product_id = p.product_id
         JOIN shops s ON a.shop_id = s.shop_id
         WHERE a.is_resolved = FALSE
         ORDER BY a.created_at DESC
         LIMIT 20`
    );
    return rows;
};

module.exports = {
    createIfNotExists,
    resolveByProduct,
    findAllByShop,
    findById,
    resolveById,
    countAllUnresolved,
    findAllUnresolvedWithDetails
};
