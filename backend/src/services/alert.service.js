const alertRepository = require('../repositories/alert.repository');
const pool = require('../config/db');

const getActiveAlerts = async (shopId) => {
     return await alertRepository.findAllByShop(shopId);
}

const resolveAlert = async (alertId, shopId) => {
     const alert = await alertRepository.findById(alertId);
     if (!alert) throw {status:404, message:'Alert not found'};
     if (!alert.shop_id !== parseInt(shopId)) throw { status : 403, message: 'Access denied'};

     await alertRepository.resolveById(alertId);
     return {message:'Alert resolved successfully'};
};

const getAdminAlertCount = async () => {
    return await alertRepository.countAllUnresolved();
};

const getAdminNotifications = async () => {
    const alerts = await alertRepository.findAllUnresolvedWithDetails();

    const [[{ failed_24h }]] = await pool.query(
        "SELECT COUNT(*) AS failed_24h FROM backups WHERE status = 'failed' AND created_at >= NOW() - INTERVAL 24 HOUR"
    );

    const [failedBackups] = await pool.query(
        `SELECT b.backup_id, b.file_name, b.created_at, s.shop_name
         FROM backups b
         JOIN shops s ON b.shop_id = s.shop_id
         WHERE b.status = 'failed'
         ORDER BY b.created_at DESC
         LIMIT 10`
    );

    const [[{ new_shops_today }]] = await pool.query(
        'SELECT COUNT(*) AS new_shops_today FROM shops WHERE DATE(created_at) = CURDATE()'
    );

    const total_unread = alerts.length + failedBackups.length;

    return {
        total_unread,
        alerts,
        failed_backups: failedBackups,
        new_shops_today
    };
};

module.exports ={
           getActiveAlerts,
           resolveAlert,
           getAdminAlertCount,
           getAdminNotifications
          }