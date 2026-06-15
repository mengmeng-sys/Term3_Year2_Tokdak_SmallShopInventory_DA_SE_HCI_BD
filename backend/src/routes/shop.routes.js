const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
 res.json({message:"Shop router is working"})
});

module.exports = router;