import api from './axiosInstance';
const getAll = () => api.get('/alerts');
const resolve = (id) => api.patch(`/alerts/${id}/resolve`);
const getAdminCount = () => api.get('/alerts/admin/count');
const getAdminNotifications = () => api.get('/alerts/admin/notifications');
export default { getAll, resolve, getAdminCount, getAdminNotifications };
