const pool = require('../config/db');

const findByShopId = async (shopId) => {
    const [rows] = await pool.query(
        'SELECT * FROM shop_settings WHERE shop_id = ?',
        [shopId]
    );
    return rows[0];
};

const update = async (shopId, settingsData) => {
    const { language, currency, low_stock_threshold, notification_email, notification_app } = settingsData;

    await pool.query(
        `UPDATE shop_settings 
         SET language = ?, currency = ?, low_stock_threshold = ?, 
             notification_email = ?, notification_app = ?
         WHERE shop_id = ?`,
        [language, currency, low_stock_threshold, notification_email, notification_app, shopId]
    );
};

const createDefault = async (shopId) => {
    await pool.query(
        `INSERT INTO shop_settings (shop_id, language, currency, low_stock_threshold, notification_email, notification_app)
         VALUES (?, 'en', 'USD', 5, TRUE, TRUE)`,
        [shopId]
    );
};

module.exports = {
    findByShopId,
    update,
    createDefault
};