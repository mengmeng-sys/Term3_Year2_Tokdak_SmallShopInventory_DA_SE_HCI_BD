const stockRepository = require('../repositories/stock.repository');
const productRepository = require('../repositories/product.repository');
const alertRepository = require('../repositories/alert.repository');

const restock = async (shopId, userId, productId, quantity, note) => {
    // 1. Get the product and verify it belongs to this shop
    const product = await productRepository.findById(productId, shopId);
    if (!product) throw { status: 404, message: 'Product not found' };

    if (quantity <= 0) throw { status: 400, message: 'Quantity must be greater than zero' };

    const quantityBefore = product.current_quantity;
    const quantityAfter = quantityBefore + quantity;

    // 2. Update product stock level
    await productRepository.updateQuantity(productId, shopId, quantityAfter);

    // 3. Log the transaction
    await stockRepository.createTransaction({
        product_id: productId,
        user_id: userId,
        type: 'restock',
        quantity_changed: quantity,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        note: note || null
    });

    // 4. If stock is now healthy, resolve any existing alerts for this product
    if (quantityAfter > product.min_quantity) {
        await alertRepository.resolveByProduct(productId);
    }

    return {
        product_name: product.name,
        quantity_before: quantityBefore,
        quantity_added: quantity,
        quantity_after: quantityAfter
    };
};

const recordSale = async (shopId, userId, productId, quantity, note) => {
    const product = await productRepository.findById(productId, shopId);
    if (!product) throw { status: 404, message: 'Product not found' };

    if (quantity <= 0) throw { status: 400, message: 'Quantity must be greater than zero' };
    if (quantity > product.current_quantity) throw { status: 400, message: 'Not enough stock available' };

    const quantityBefore = product.current_quantity;
    const quantityAfter = quantityBefore - quantity;

    // 1. Update product stock level
    await productRepository.updateQuantity(productId, shopId, quantityAfter);

    // 2. Log the transaction
    await stockRepository.createTransaction({
        product_id: productId,
        user_id: userId,
        type: 'sale',
        quantity_changed: -quantity,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        note: note || null
    });

    // 3. Check if stock is now low or out — create alert if needed
    if (quantityAfter === 0) {
        await alertRepository.createIfNotExists(productId, shopId, 'out_of_stock');
    } else if (quantityAfter <= product.min_quantity) {
        await alertRepository.createIfNotExists(productId, shopId, 'low_stock');
    }

    return {
        product_name: product.name,
        quantity_before: quantityBefore,
        quantity_sold: quantity,
        quantity_after: quantityAfter
    };
};

const getProductHistory = async (shopId, productId) => {
    const product = await productRepository.findById(productId, shopId);
    if (!product) throw { status: 404, message: 'Product not found' };

    return await stockRepository.findByProduct(productId, shopId);
};

const getShopHistory = async (shopId) => {
    return await stockRepository.findAllByShop(shopId);
};

const getLowStock = async (shopId) => {
    return await stockRepository.findLowStock(shopId);
};

module.exports = {
    restock,
    recordSale,
    getProductHistory,
    getShopHistory,
    getLowStock
};
