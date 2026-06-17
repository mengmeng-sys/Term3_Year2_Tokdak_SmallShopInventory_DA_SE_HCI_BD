const authService = require('../services/user.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.json(users);
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
        const userId = req.params.id;
        const updateData = req.body;
        const result = await authService.updateUser(userId, updateData);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }  
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await authService.deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}