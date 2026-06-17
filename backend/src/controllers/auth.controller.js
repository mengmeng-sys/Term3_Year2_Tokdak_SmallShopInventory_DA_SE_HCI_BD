const authService = require('../services/auth.service')

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json({message:'Email and password are required'});

        const result = await authService.login(email, password);
        res.status(200).json({message:'Login successful', data : result});

    } catch(err) {

        if(err.status){
            return res.status(err.status).json({message: err.message});
            next(err);
        }
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, DOB, gender, shop_name, address, phone } = req.body;

        // Basic validation
        if (!name || !email || !password || !shop_name) {
            return res.status(400).json({
                message: 'Name, email, password, and shop name are required'
            });
        }

        const userData = { name, email, password, DOB, gender };
        const shopData = { shop_name, address, phone };

        const result = await authService.register(userData, shopData);

        res.status(201).json({
            message: 'Registration successful',
            data: result
        });

    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ message: err.message });
        }
        next(err);
    }
};
const getMe = async (req, res, next) =>{
    try{
        const userId = req.user.id; // comes from authMiddleware
        const user = await authService.getMe(userId);
        res.status(200).json({message:'User fetched successfully', data: user});
    }catch(err){
        if (err.status){
            return res.status(err.status).json({message: err.message});
        }
        next(err);
    }
};
const changePassword = async (req,res,next) =>{
    try{
        const userId = req.user.id;
        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({message: 'Old and New password are required'});
        }
        const result = await authService.changePassword(userId,oldPassword,newPassword);
        res.status(200).json({message:result.message})
    }catch(err){
        if(err.status){
            return res.status(200).json({message:err.message});    
        }
    }
};
module.exports = {login,register,getMe,changePassword};
