const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const productControllers = require('../controllers/product.controller');
const attachShop = require('../middlewares/attachShop.middleware');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const router = express.Router();

router.get('/test',(req,res)=>{
 res.json({message:"Product router is working."})
})

router.get('/',authMiddleware,attachShop,roleMiddleware('client'),productControllers.getAll);
router.get('/export',authMiddleware,attachShop,roleMiddleware('client'),productControllers.exportProducts);
router.post('/import', authMiddleware,attachShop,roleMiddleware('client'),upload.single('file'),productControllers.importProducts)
router.get('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.getById);
router.put('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.update);
router.post('/',authMiddleware,attachShop,roleMiddleware('client'),productControllers.create);
router.delete('/:id',authMiddleware,attachShop,roleMiddleware('client'),productControllers.remove);

module.exports = router;