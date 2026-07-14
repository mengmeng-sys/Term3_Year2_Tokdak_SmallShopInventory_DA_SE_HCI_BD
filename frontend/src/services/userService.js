import api from './axiosInstance';
const getAll = (page = 1, limit = 10, search = '', status = '') =>
  api.get(`/users?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}${status ? `&status=${status}` : ''}`);
const getById = (id) => api.get(`/users/${id}`);
const update = (id, data) => api.put(`/users/${id}`, data);
const uploadAvatar = (id, formData) => api.post(`/users/${id}/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
const toggleStatus = (id, is_active) => api.patch(`/users/${id}/status`, { is_active });
const remove = (id) => api.delete(`/users/${id}`);
export default { getAll, getById, update, uploadAvatar, toggleStatus, remove };