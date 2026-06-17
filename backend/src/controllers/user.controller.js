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
        const targetUserId = req.params.id; // The account being changed
        const updateData = req.body;
        
        // 1. Get the logged-in user's details from your auth middleware
        const loggedInUser = req.user; 

        // 2. Enforce Security Rule: 
        // If they are NOT an admin, they MUST match the target user ID
        if (loggedInUser.role !== 'admin' && String(loggedInUser.id) !== String(targetUserId)) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own account' });
        }

        // 3. Proceed if the check passes
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

        // Block if they are a client AND trying to delete someone else
        if (loggedInUser.role !== 'admin' && String(loggedInUser.id) !== String(targetUserId)) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
        }

        const result = await authService.deleteUser(targetUserId);
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