const express = require('express');
const authController = require('../controllers/auth.controller')
const router = express.Router();
router.get('/',(req,res)=>{
 res.json({message:'Auth router is working.'})
})
router.post('/login',authController.login)

module.exports = router;