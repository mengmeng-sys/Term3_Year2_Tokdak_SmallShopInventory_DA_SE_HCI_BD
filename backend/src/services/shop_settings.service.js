const shopSettingsRepository = require('../repositories/shop_settings.repository');

const getSettings = async (shopId) => {
    let settings = await shopSettingsRepository.findByShopId(shopId);

    // If no settings exist yet, create defaults automatically
    if (!settings) {
        await shopSettingsRepository.createDefault(shopId);
        settings = await shopSettingsRepository.findByShopId(shopId);
    }

    return settings;
};

const updateSettings = async (shopId, settingsData) => {
    const settings = await shopSettingsRepository.findByShopId(shopId);

    // If no settings row exists yet, create default first then update
    if (!settings) {
        await shopSettingsRepository.createDefault(shopId);
    }

    await shopSettingsRepository.update(shopId, settingsData);
    return { message: 'Settings updated successfully' };
};

module.exports = {
    getSettings,
    updateSettings
};