import api from './axiosInstance';
const getAll = () => api.get('/users');
const getById = (id) => api.get(`/users/${id}`);
const update = (id, data) => api.put(`/users/${id}`, data);
const toggleStatus = (id, is_active) => api.patch(`/users/${id}/status`, { is_active });
const remove = (id) => api.delete(`/users/${id}`);
export default { getAll, getById, update, toggleStatus, remove };
