import api from './axiosInstance';
const getSummary = () => api.get('/reports/summary');
const getHistory = (filters) => api.get('/reports/history', { params: filters });
const getMostRestocked = () => api.get('/reports/most-restocked');
const getMostSold = () => api.get('/reports/most-sold');
export default { getSummary, getHistory, getMostRestocked, getMostSold };
