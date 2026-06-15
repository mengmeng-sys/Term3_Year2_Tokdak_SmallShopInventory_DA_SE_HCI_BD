const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
 res.json({message:"Report router is working"})
});

module.exports = router;