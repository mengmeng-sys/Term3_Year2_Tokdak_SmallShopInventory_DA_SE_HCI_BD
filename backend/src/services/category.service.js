const categoryRepository = require('../repositories/category.repository');

const create = async (shopId, name) => {
    if (!name) {
        throw new Error('Category name is required');
    }

    return await categoryRepository.create(shopId, name);
};

const getAll = async (shopId) => {
    return await categoryRepository.findAllByShop(shopId);
};

const getById = async (categoryId, shopId) => {
    const category = await categoryRepository.findById(
        categoryId,
        shopId
    );

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
};

const update = async (categoryId, shopId, name) => {
    const result = await categoryRepository.update(
        categoryId,
        shopId,
        name
    );

    if (result.affectedRows === 0) {
        throw new Error('Category not found');
    }

    return result;
};

const remove = async (categoryId, shopId) => {
    const result = await categoryRepository.remove(
        categoryId,
        shopId
    );

    if (result.affectedRows === 0) {
        throw new Error('Category not found');
    }

    return result;
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};