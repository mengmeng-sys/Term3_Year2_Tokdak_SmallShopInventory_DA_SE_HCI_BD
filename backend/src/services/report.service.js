const reportRepository = require('../repositories/report.repository');

const getSummary = async (shopId) =>{
     return await reportRepository.getSummary(shopId);
};

const getHistory = async (shopId, filters) => {
     return await reportRepository.getTransactionHistory(shopId, filters);
};

const getMostRestocked = async (shopId) =>{
     return await reportRepository.getMostRestocked(shopId);
};

const getMostSold = async (shopId) => {
     return await reportRepository.getMostSold(shopId);
};

module.exports = {
        getSummary,
        getHistory,
        getMostRestocked,
        getMostSold
}