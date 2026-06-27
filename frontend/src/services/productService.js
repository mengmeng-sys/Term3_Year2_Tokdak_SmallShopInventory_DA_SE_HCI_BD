import api from './axiosInstance';
const getAll = (filters) => api.get('/products', { params: filters });
const getById = (id) => api.get(`/products/${id}`);
const create = (data) => api.post('/products', data);
const update = (id, data) => api.put(`/products/${id}`, data);
const remove = (id) => api.delete(`/products/${id}`);
const exportCsv = () => api.get('/products/export', { responseType: 'blob' });
const importCsv = (formData) => api.post('/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export default { getAll, getById, create, update, remove, exportCsv, importCsv };
