import api from './axiosInstance';

const getAll = (page = 1, limit = 10) => api.get(`/backups?page=${page}&limit=${limit}`);
const getStats = () => api.get('/backups/stats');
const getById = (id) => api.get(`/backups/${id}`);
const create = (data) => api.post('/backups', data);
const download = (id) => api.get(`/backups/${id}/download`, { responseType: 'blob' });
const remove = (id) => api.delete(`/backups/${id}`);

const deleteBatch = (ids) => api.post('/backups/batch-delete', { ids });

export default { getAll, getStats, getById, create, download, remove, deleteBatch };
