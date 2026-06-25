const shopSettingsService = require('../services/shop_settings.service');

const getSettings = async (req, res, next) => {
    try {
        const settings = await shopSettingsService.getSettings(req.shop_id);
        res.status(200).json({ message: 'Settings fetched successfully', data: settings });
    } catch (err) {
        next(err);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const result = await shopSettingsService.updateSettings(req.shop_id, req.body);
        res.status(200).json({ message: result.message });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSettings,
    updateSettings
};