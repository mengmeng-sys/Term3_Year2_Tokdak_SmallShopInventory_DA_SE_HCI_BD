const stockService = require('../services/stock.service');

const restock = async (req, res, next) => {
    try {
        const { product_id, quantity, note } = req.body;

        if (!product_id || !quantity) {
            return res.status(400).json({ message: 'product_id and quantity are required' });
        }

        const result = await stockService.restock(
            req.shop_id,
            req.user.id,
            product_id,
            parseInt(quantity),
            note
        );

        res.status(200).json({ message: 'Product restocked successfully', data: result });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
};

const recordSale = async (req, res, next) => {
    try {
        const { product_id, quantity, note } = req.body;

        if (!product_id || !quantity) {
            return res.status(400).json({ message: 'product_id and quantity are required' });
        }

        const result = await stockService.recordSale(
            req.shop_id,
            req.user.id,
            product_id,
            parseInt(quantity),
            note
        );

        res.status(200).json({ message: 'Sale recorded successfully', data: result });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
};

const getProductHistory = async (req, res, next) => {
    try {
        const history = await stockService.getProductHistory(
            req.shop_id,
            req.params.productId
        );
        res.status(200).json({ message: 'Stock history fetched successfully', data: history });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
};

const getShopHistory = async (req, res, next) => {
    try {
        const history = await stockService.getShopHistory(req.shop_id);
        res.status(200).json({ message: 'Shop stock history fetched successfully', data: history });
    } catch (err) {
        next(err);
    }
};

const getLowStock = async (req, res, next) => {
    try {
        const products = await stockService.getLowStock(req.shop_id);
        res.status(200).json({ message: 'Low stock products fetched successfully', data: products });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    restock,
    recordSale,
    getProductHistory,
    getShopHistory,
    getLowStock
};
