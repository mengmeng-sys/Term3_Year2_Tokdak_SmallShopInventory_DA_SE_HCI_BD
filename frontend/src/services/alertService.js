import api from './axiosInstance';
const getAll = () => api.get('/alerts');
const resolve = (id) => api.patch(`/alerts/${id}/resolve`);
export default { getAll, resolve };
