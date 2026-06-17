const shoprepository = require('../repositories/shop.repository');

const getAllShops = async () => {
    return await shoprepository.findAllShops();
}

const getShopById = async (shopId) => {
    const shop = await shoprepository.findShopById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    return shop;
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

module.exports = {
    getAllShops,
    getShopById,
    updateShop,
    deleteShop
};
