const pool = require('../config/db')

const findAllShops = async () => {
    const [rows] = await pool.query(
        'SELECT shop_id, user_id, shop_name, address, phone, created_at FROM shops'
    );
    return rows;
}

const findShopById = async (shopId) => {
    const [rows] = await pool.query(
        'SELECT shop_id, user_id, shop_name, address, phone, created_at FROM shops WHERE shop_id = ?',
        [shopId]
    );
    return rows[0];
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

module.exports = {
    findAllShops,
    findShopById,
    updateShop,
    deleteShop
};