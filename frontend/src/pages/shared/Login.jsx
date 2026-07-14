import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Eye, EyeOff } from 'lucide-react';
import TokdakLogo from '../../components/common/TokdakLogo';
import '../../styles/Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      if (user?.role !== activeTab) {
        throw new Error('role_mismatch');
      }

      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err.message === 'role_mismatch'
        ? `This account is not a${activeTab === 'admin' ? 'n' : ''} ${activeTab} user`
        : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-blob-orange"></div>
      <div className="login-blob-blue"></div>

      <div className="login-card">
        <div className="login-card-inner">

          {/* Logo */}
          <div className="login-logo">
            <TokdakLogo height={40} />
            <p className="login-logo-subtitle">Small Shop Stock Inventory System</p>
          </div>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'client' ? 'active' : ''}`}
              onClick={() => setActiveTab('client')}
            >
              Client Login
            </button>
            <button
              className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Login
            </button>
            <div
              className="login-tab-indicator"
              style={{ transform: `translateX(${activeTab === 'client' ? '0%' : '100%'})` }}
            />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input
                type="email"
                className="login-input"
                placeholder="admin@tokdak.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-center text-sm mt-2">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* ← This is the important change */}
            <div className="login-forgot">
              <button 
                type="button" 
                className="fp-link"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="login-footer">© 2026 TOKDAK | CodeDuo</p>
    </div>
  );
};

export default Login;