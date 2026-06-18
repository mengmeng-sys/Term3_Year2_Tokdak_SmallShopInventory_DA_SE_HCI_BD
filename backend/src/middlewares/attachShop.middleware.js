const shopRepository = require('../repositories/shop.repository');

const attachShop = async (req, res, next) => {
    try {
        // Admin doesn't have a shop, skip this check for admin routes
        if (req.user.role === 'admin') {
            return next();
        }

        const shop = await shopRepository.findByUserId(req.user.id);
        if (!shop) {
            return res.status(404).json({ message: 'No shop found for this account' });
        }

        req.shop_id = shop.shop_id; // attach it here, ONCE
        next();

    } catch (err) {
        next(err);
    }
};

module.exports = attachShop;