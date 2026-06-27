import api from './axiosInstance';

const login = (email, password) => api.post('/auth/login', { email, password });
const getMe = () => api.get('/auth/me');
const changePassword = (data) => api.put('/auth/change-password', data);
const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
const resetPasswordOtp = (data) => api.post('/auth/reset-password-otp', data);
const register = (data) => api.post('/auth/register', data);
const verifyRegistration = (data) => api.post('/auth/verify-registration', data);

// Export with proper naming
export default { 
  login, 
  getMe, 
  changePassword, 
  forgotPassword, 
  resetPasswordOtp, 
  register, 
  verifyRegistration 
};