const authService = require('../services/user.service');

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const result = await authService.getAllUsers(page, limit, search, status);
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await authService.getUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const updateData = req.body;
        const loggedInUser = req.user;

        if (loggedInUser.role !== 'admin' && String(loggedInUser.id) !== String(targetUserId)) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own account' });
        }

        const result = await authService.updateUser(targetUserId, updateData);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const loggedInUser = req.user;

        if (loggedInUser.role !== 'admin' && String(loggedInUser.id) !== String(targetUserId)) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
        }

        const result = await authService.deleteUser(targetUserId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Cannot delete user: user has related stock transactions or backups. Please remove them first.' });
        }
        res.status(404).json({ message: error.message });
    }
}

const toggleUserStatus = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const { is_active } = req.body;

        const result = await authService.toggleUserStatus(targetUserId, is_active);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const uploadAvatar = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const loggedInUser = req.user;

        if (String(loggedInUser.id) !== String(targetUserId)) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own avatar' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const result = await authService.updateAvatar(targetUserId, avatarUrl);
        res.json({ message: 'Avatar updated successfully', avatar_url: avatarUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    uploadAvatar
};
