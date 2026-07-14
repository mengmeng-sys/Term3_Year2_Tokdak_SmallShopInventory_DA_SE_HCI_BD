const activityRepository = require('../repositories/activity.repository');

const logActivity = async (adminId, actionType, targetName, targetEmail, details) => {
    return await activityRepository.insert(adminId, actionType, targetName, targetEmail, details);
};

const getRecentActivities = async (limit = 20) => {
    return await activityRepository.findAllRecent(limit);
};

const getRecentCount = async (hours = 24) => {
    return await activityRepository.countRecent(hours);
};

module.exports = { logActivity, getRecentActivities, getRecentCount };
