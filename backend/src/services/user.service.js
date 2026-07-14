const authRepository = require('../repositories/user.repository');

const getAllUsers = async (page = 1, limit = 10, search = '', status = '') => {
    return await authRepository.allUser(page, limit, search, status);
}

const getUserById = async (userId) => {
    const user = await authRepository.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

const updateUser = async (userId, updateData) => {
    const result = await authRepository.updateUser(userId, updateData);
    if (result.affectedRows === 0) {
        throw new Error("User not found or no changes made");
    }
    return result;
}

const deleteUser = async (userId) => {
    const result = await authRepository.removeUser(userId);
    if (result.affectedRows === 0) {
        throw new Error("User not found");
    }
    return result;
}

const toggleUserStatus = async (userId, isActive) => {
    const user = await authRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return await authRepository.updateUserStatus(userId, isActive);
}

const updateAvatar = async (userId, avatarUrl) => {
    const user = await authRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return await authRepository.updateAvatar(userId, avatarUrl);
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateAvatar
};
