const dashboardService = require('../services/dashboard.service');

const getClientDashboard = async (req, res, next) => {
     try{
        const data = await dashboardService.getClientDashboard(req.shop_id);
        res.status(200).json({message:'Dashboard data fetched successfully', data});
     }catch(err){
        next(err);
     }
};

const getAdminDashboard = async (req, res, next) => {
     try{
        const data = await dashboardService.getAdminDashboard();
        res.status(200).json({message: 'Admin dashboard data fetched successfully', data});
     }catch(err) {
        next(err);
     }
};
module.exports ={
      getAdminDashboard,
      getClientDashboard
};
