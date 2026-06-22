const reportService = require('../services/report.service');

const getSummary = async (req, res, next) => {
      try {
          const data = await reportService.getSummary(req.shop_id);
          res.status(200).json({message:'Report summary fetched successfully', data});
      }catch(err){
          next(err);
      }
}

const getHistory = async (req, res, next) => {
      try {
          const filters = {
              type: req.query.type,
              product_id: req.query.product_id,
              from:req.query.from,
              to:req.query.to
          };
          const data = await reportService.getHistory(req.shop_id, filters);
          res.status(200).json({message:'Transaction history fetched successfully', data});
      }catch(err){
          next(err);
      }
};

const getMostRestocked = async (req, res, next) =>{
      try{
         const data = await reportService.getMostRestocked(req.shop_id);
         res.status(200).json({message:'Most restocked products fetched', data});
      }catch(err){
         next(err);
      }
};

const getMostSold = async (req, res, next) => {
    try {
        const data = await reportService.getMostSold(req.shop_id);
        res.status(200).json({ message: 'Most sold products fetched', data });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSummary,
    getHistory,
    getMostRestocked,
    getMostSold
};