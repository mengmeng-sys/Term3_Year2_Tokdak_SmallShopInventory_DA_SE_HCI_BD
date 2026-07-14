import api from './axiosInstance';
const getAll = (page = 1, limit = 10, search = '') => api.get(`/shops?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`);
const getStats = () => api.get('/shops/stats');
const getById = (id) => api.get(`/shops/${id}`);
const getByUserId = (userId) => api.get(`/shops/user/${userId}`);
const getDetails = (id) => api.get(`/shops/${id}/details`);
const update = (id, data) => api.put(`/shops/${id}`, data);
const remove = (id) => api.delete(`/shops/${id}`);
export default { getAll, getStats, getById, getByUserId, getDetails, update, remove };
