import api from './axiosInstance';
const getAll = () => api.get('/backups');
const create = () => api.post('/backups');
export default { getAll, create };
