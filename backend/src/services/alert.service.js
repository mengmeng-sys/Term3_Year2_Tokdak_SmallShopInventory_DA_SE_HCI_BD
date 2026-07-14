const alertRepository = require('../repositories/alert.repository');
const activityRepository = require('../repositories/activity.repository');
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
    const activities = await activityRepository.findAllRecent(20);
    const count = await activityRepository.countRecent(24);

    return {
        total_unread: count,
        activities
    };
};

module.exports ={
           getActiveAlerts,
           resolveAlert,
           getAdminAlertCount,
           getAdminNotifications
          }