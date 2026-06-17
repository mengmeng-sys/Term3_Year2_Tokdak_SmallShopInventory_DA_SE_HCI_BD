const authRepository = require('../repositories/user.repository');

const getAllUsers = async () => {
    const users = await authRepository.allUser();
    return users;
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

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};