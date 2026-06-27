import api from './axiosInstance';
const restock = (data) => api.post('/stock/restock', data);
const recordSale = (data) => api.post('/stock/sale', data);
const getLowStock = () => api.get('/stock/low-stock');
const getHistory = () => api.get('/stock/history');
const getProductHistory = (productId) => api.get(`/stock/history/${productId}`);
export default { restock, recordSale, getLowStock, getHistory, getProductHistory };
