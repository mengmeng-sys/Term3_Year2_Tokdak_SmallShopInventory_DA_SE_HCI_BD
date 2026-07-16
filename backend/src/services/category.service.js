const categoryRepository = require('../repositories/category.repository');

const create = async (shopId, name, description) => {
    if (!name) {
        throw new Error('Category name is required');
    }

    return await categoryRepository.create(shopId, name, description);
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

const update = async (categoryId, shopId, name, description) => {
    const result = await categoryRepository.update(
        categoryId,
        shopId,
        name,
        description
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