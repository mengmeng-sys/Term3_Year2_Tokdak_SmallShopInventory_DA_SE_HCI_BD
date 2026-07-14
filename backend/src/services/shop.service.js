const shoprepository = require('../repositories/shop.repository');
const alertRepository = require('../repositories/alert.repository');

const getAllShops = async (page = 1, limit = 10, search = '') => {
    return await shoprepository.findAllShops(page, limit, search);
}

const getShopById = async (shopId) => {
    const shop = await shoprepository.findShopById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    return shop;
}

const getShopByUserId = async (userId) => {
    const shop = await shoprepository.findByUserId(userId);
    if (!shop) {
        throw new Error('Shop not found for this user');
    }
    return shop;
}

const getShopDetails = async (shopId) => {
    const shop = await shoprepository.findShopById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    const stats = await shoprepository.getShopStats(shopId);
    return { ...shop, ...stats };
}

const updateShop = async (shopId, updateData) => {
    const shop = await shoprepository.findShopById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    return await shoprepository.updateShop(shopId, updateData);
}

const deleteShop = async (shopId) => {
    const shop = await shoprepository.findShopById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    return await shoprepository.deleteShop(shopId);
}

const getStats = async () => {
    const shopStats = await shoprepository.getStats();
    const unresolvedAlerts = await alertRepository.countAllUnresolved();
    return { ...shopStats, unresolved_alerts: unresolvedAlerts };
};

module.exports = {
    getAllShops,
    getShopById,
    getShopByUserId,
    getShopDetails,
    getStats,
    updateShop,
    deleteShop
};
