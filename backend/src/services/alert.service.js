const alertRepository = require('../repositories/alert.repository');

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

module.exports ={
           getActiveAlerts,
           resolveAlert,
           getAdminAlertCount
          }