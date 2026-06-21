const alertService = require('../services/alert.service');

const getActiveAlerts = async (req, res, next) => {
      try{
         const alerts = await alertService.getActiveAlerts(req.shop_id);
         res.status(200).json({message: 'Alerts fetched successfully', data: alerts});
      }catch(err){
         next(err);
      }
};

const resolveAlert = async (req, res, next) => {
      try{
         const result = await alertService.resolveAlert(req.params.id, req.shop_id);
         res.status(200).json({message: result.message});
      }catch(err){
         if(err.status) return res.status(err.status).json({message:err.message});
         next(err);
      }
};

module.exports = {
       getActiveAlerts,
       resolveAlert
}