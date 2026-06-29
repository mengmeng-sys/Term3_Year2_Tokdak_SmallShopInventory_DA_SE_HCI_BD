const pool = require('../config/db')

const findAllShops = async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
        where = 'WHERE (s.shop_name LIKE ? OR u.name LIKE ? OR s.address LIKE ?)';
        const pattern = `%${search}%`;
        params.push(pattern, pattern, pattern);
    }
    params.push(limit, offset);
    const [rows] = await pool.query(
        `SELECT s.shop_id, s.user_id, s.shop_name, s.address, s.phone, s.created_at,
                u.name AS owner_name, u.is_active AS active
         FROM shops s
         JOIN users u ON s.user_id = u.user_id
         ${where}
         ORDER BY s.created_at DESC
         LIMIT ? OFFSET ?`,
        params
    );
    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const [[{ count }]] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM shops s
         JOIN users u ON s.user_id = u.user_id
         ${where}`,
        countParams
    );
    return { rows, total: count };
}

const findShopById = async (shopId) => {
    const [rows] = await pool.query(
        `SELECT s.shop_id, s.user_id, s.shop_name, s.address, s.phone, s.created_at,
                u.name AS owner_name, u.email AS owner_email, u.is_active AS active
         FROM shops s
         JOIN users u ON s.user_id = u.user_id
         WHERE s.shop_id = ?`,
        [shopId]
    );
    return rows[0];
}

const findByUserId = async (userId) => {
    const [rows] = await pool.query(
        'SELECT shop_id, user_id, shop_name, address, phone, created_at FROM shops WHERE user_id = ?',
        [userId]
    );
    return rows[0];
}

const getShopStats = async (shopId) => {
    const [[{ products }]] = await pool.query(
        'SELECT COUNT(*) AS products FROM products WHERE shop_id = ?', [shopId]
    );
    const [[{ categories }]] = await pool.query(
        'SELECT COUNT(*) AS categories FROM categories WHERE shop_id = ?', [shopId]
    );
    const [[{ alerts }]] = await pool.query(
        'SELECT COUNT(*) AS alerts FROM alerts WHERE shop_id = ? AND is_resolved = FALSE', [shopId]
    );
    return { total_products: products, categories_count: categories, alerts_count: alerts };
}

const updateShop = async (shopId, updateData) => {
    const { shop_name, address, phone } = updateData;
    const [result] = await pool.query(
        'UPDATE shops SET shop_name = ?, address = ?, phone = ? WHERE shop_id = ?',
        [shop_name, address, phone, shopId]
    );
    return result;
}

const deleteShop = async (shopId) => {
    const [result] = await pool.query(
        'DELETE FROM shops WHERE shop_id = ?',
        [shopId]
    );
    return result;
}

const getStats = async () => {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM shops');

    const [[{ new_today }]] = await pool.query(
        'SELECT COUNT(*) AS new_today FROM shops WHERE DATE(created_at) = CURDATE()'
    );

    const [[{ this_month }]] = await pool.query(
        'SELECT COUNT(*) AS this_month FROM shops WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())'
    );

    const [[{ last_month }]] = await pool.query(
        'SELECT COUNT(*) AS last_month FROM shops WHERE YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)'
    );

    return { total, new_today, this_month, last_month };
};

module.exports = {
    findAllShops,
    findShopById,
    findByUserId,
    getShopStats,
    getStats,
    updateShop,
    deleteShop
};