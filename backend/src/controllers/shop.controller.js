const shopService = require("../services/shop.service")

const getAllShops = async (req, res) => {
    try {
        const shops = await shopService.getAllShops();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getShopById = async (req, res) => {
    try {
        const shopId = req.params.id;
        const shop = await shopService.getShopById(shopId);
        res.json(shop);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        const updateData = req.body;
        const loggedInUser = req.user; // 1. Get logged-in user from auth middleware

        // 2. Fetch shop first to see who owns it
        const shop = await shopService.getShopById(shopId);

        // 3. ENFORCE SECURITY RULE:
        // If they are not an admin, their user_id MUST match the shop's user_id
        if (loggedInUser.role !== 'admin' && loggedInUser.id !== shop.user_id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this shop' });
        }

        const result = await shopService.updateShop(shopId, updateData);
        res.json({ message: 'Shop updated successfully' });
    } catch (error) {
        // If getShopById throws "Shop not found", it lands here automatically
        const statusCode = error.message === 'Shop not found' ? 404 : 500;
        res.status(statusCode).json({ message: error.message });
    }
}

const deleteShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        const loggedInUser = req.user;

        const shop = await shopService.getShopById(shopId);
        if (loggedInUser.role !== 'admin' && loggedInUser.id !== shop.user_id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this shop' });
        }

        await shopService.deleteShop(shopId);
        res.json({ message: 'Shop deleted successfully' });
        
    } catch (error) {

        if (error.errno === 1451 || error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: 'Cannot delete this shop because it still contains active categories or products. Please delete them first.' 
            });
        }
        
        const statusCode = error.message === 'Shop not found' ? 404 : 500;
        res.status(statusCode).json({ message: error.message });
    }
}



module.exports = {
    getAllShops,
    getShopById,
    updateShop,
    deleteShop
}
