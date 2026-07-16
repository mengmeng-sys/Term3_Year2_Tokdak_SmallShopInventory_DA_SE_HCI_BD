const categoryService = require('../services/category.service');
const shopRepository = require('../repositories/shop.repository');

const create = async (req, res) => {
    try {
        const { name, description } = req.body;

        const shop = await shopRepository.findByUserId(req.user.id);

        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        const result = await categoryService.create(
            shop.shop_id,
            name,
            description
        );

        res.status(201).json({
            message: 'Category created successfully',
            data: result
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const shop = await shopRepository.findByUserId(req.user.id);

        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }
        const categories = await categoryService.getAll(
            shop.shop_id
        );

        res.status(200).json({
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const shop = await shopRepository.findByUserId(req.user.id);

        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        const category = await categoryService.getById(
            categoryId,
            shop.shop_id
        );

        res.status(200).json({
            data: category
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        const shop = await shopRepository.findByUserId(req.user.id);

        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        await categoryService.update(
            categoryId,
            shop.shop_id,
            name,
            description
        );

        res.status(200).json({
            message: 'Category updated successfully'
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const shop = await shopRepository.findByUserId(req.user.id);

        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        await categoryService.remove(
            categoryId,
            shop.shop_id
        );

        res.status(200).json({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        // MySQL foreign key restriction
        if (
            error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.errno === 1451
        ) {
            return res.status(409).json({
                message: 'Cannot delete category because products exist in this category'
            });
        }

        res.status(404).json({
            message: error.message
        });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};