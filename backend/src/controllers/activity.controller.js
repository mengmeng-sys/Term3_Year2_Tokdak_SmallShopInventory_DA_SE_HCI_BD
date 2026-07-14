const activityService = require('../services/activity.service');

const getActivities = async (req, res, next) => {
    try {
        const activities = await activityService.getRecentActivities();
        const count = await activityService.getRecentCount();
        res.status(200).json({ data: { activities, total_unread: count } });
    } catch (err) {
        next(err);
    }
};

module.exports = { getActivities };
