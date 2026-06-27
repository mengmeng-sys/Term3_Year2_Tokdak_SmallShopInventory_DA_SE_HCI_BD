import api from './axiosInstance';
const getClientDashboard = () => api.get('/dashboard/client');
const getAdminDashboard = () => api.get('/dashboard/admin');
export default { getClientDashboard, getAdminDashboard };
