import api from './axiosInstance';
const getAll = () => api.get('/shops');
const getById = (id) => api.get(`/shops/${id}`);
const update = (id, data) => api.put(`/shops/${id}`, data);
export default { getAll, getById, update };
