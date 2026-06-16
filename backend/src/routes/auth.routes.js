const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const router = express.Router();
router.get('/',(req,res)=>{
 res.json({message:'Auth router is working.'})
})
router.post('/login',authController.login);
router.post('/register',authMiddleware,roleMiddleware('admin'),authController.register);
router.get('/me',authMiddleware,authController.getMe);
module.exports = router;