const pool = require('../config/db')

const getSummary = async (shopId) => {
    const [[totalRestocks]] = await pool.query(
        `SELECT COUNT(*) AS count FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'restock'`,
        [shopId]
    );

    const [[totalSales]] = await pool.query(
        `SELECT COUNT(*) AS count FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'sale'`,
        [shopId]
    );

    const [[totalAdded]] = await pool.query(
        `SELECT COALESCE(SUM(st.quantity_changed), 0) AS total
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'restock'`,
        [shopId]
    );

    const [[totalSold]] = await pool.query(
        `SELECT COALESCE(SUM(ABS(st.quantity_changed)), 0) AS total
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'sale'`,
        [shopId]
    );

    return {
        total_restocks: totalRestocks.count,
        total_sales: totalSales.count,
        total_quantity_added: totalAdded.total,
        total_quantity_sold: totalSold.total
    };
};

const getTransactionHistory = async (shopId, filters = {}) => {
    let sql = `
        SELECT st.*, p.name AS product_name, p.unit
        FROM stock_transactions st
        JOIN products p ON st.product_id = p.product_id
        WHERE p.shop_id = ?
    `;
    const params = [shopId];

    if (filters.type) {
        sql += ' AND st.type = ?';
        params.push(filters.type);
    }

    if (filters.product_id) {
        sql += ' AND st.product_id = ?';
        params.push(filters.product_id);
    }

    if (filters.from) {
        sql += ' AND st.created_at >= ?';
        params.push(filters.from);
    }

    if (filters.to) {
        sql += ' AND st.created_at <= ?';
        params.push(filters.to);
    }

    sql += ' ORDER BY st.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
};

const getMostRestocked = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT p.name, p.unit,
                COUNT(st.transaction_id) AS restock_count,
                SUM(st.quantity_changed) AS total_added
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'restock'
         GROUP BY st.product_id, p.name, p.unit
         ORDER BY restock_count DESC
         LIMIT ${10}`,
        [shopId]
    );
    return rows;
};

const getMostSold = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT p.name, p.unit,
                COUNT(st.transaction_id) AS sale_count,
                SUM(ABS(st.quantity_changed)) AS total_sold
         FROM stock_transactions st
         JOIN products p ON st.product_id = p.product_id
         WHERE p.shop_id = ? AND st.type = 'sale'
         GROUP BY st.product_id, p.name, p.unit
         ORDER BY sale_count DESC
         LIMIT ${10}`,
        [shopId]
    );
    return rows;
};

module.exports = {
    getSummary,
    getTransactionHistory,
    getMostRestocked,
    getMostSold
};