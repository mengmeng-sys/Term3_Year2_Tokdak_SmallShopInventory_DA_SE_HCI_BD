const dashboardRepository = require('../repositories/dashboard.repository');

const getAdminDashboard = async () => {
    return await dashboardRepository.getAdminStats();
};

const getClientDashboard = async (shopId) => {
    return await dashboardRepository.getClientStats(shopId);
};

module.exports = {
      getAdminDashboard,
      getClientDashboard
};