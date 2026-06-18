const productRepository = require('../repositories/product.repository');

const create = async (productData) => {

    if (!productData.name) {
        throw new Error('Product name is required');
    }

    if (productData.price < 0) {
        throw new Error('Price cannot be negative');
    }

    return await productRepository.create(productData);
};

const getAll = async (shopId,filters) => {
    return await productRepository.findAllByShop(shopId,filters);
};

const getById = async (productId, shopId) => {

    const product = await productRepository.findById(
        productId,
        shopId
    );

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

const update = async (
    productId,
    shopId,
    productData
) => {

    const result = await productRepository.update(
        productId,
        shopId,
        productData
    );

    if (result.affectedRows === 0) {
        throw new Error('Product not found');
    }

    return result;
};

const remove = async (productId, shopId) => {

    const result = await productRepository.remove(
        productId,
        shopId
    );

    if (result.affectedRows === 0) {
        throw new Error('Product not found');
    }

    return result;
};
const bulkImport = async (shopId, rows) => {
    const created = [];

    for (const row of rows) {
        // Find category_id by name, or you could require category_id in the CSV directly
        const categoryId = await categoryRepository.findIdByName(shopId, row.Category);

        const productData = {
            shop_id: shopId,
            category_id: categoryId,
            name: row.Name,
            description: row.Description || '',
            price: parseFloat(row.Price) || 0,
            current_quantity: parseInt(row['Current Quantity']) || 0,
            min_quantity: parseInt(row['Minimum Quantity']) || 5,
            unit: row.Unit || 'pcs'
        };

        const result = await productRepository.create(productData);
        created.push(result);
    }

    return created;
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    bulkImport
};