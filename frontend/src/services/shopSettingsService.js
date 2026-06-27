import api from './axiosInstance';
const getSettings = () => api.get('/shop-settings');
const updateSettings = (data) => api.put('/shop-settings', data);
export default { getSettings, updateSettings };
