// frontend/src/components/common/AdminSidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { key: 'shops', label: 'Shops', icon: '🏪', path: '/admin/shops' },
    { key: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { key: 'backups', label: 'Backups', icon: '💾', path: '/admin/backups' },
    { key: 'profile', label: 'Profile', icon: '👤', path: '/admin/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'A';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="dash-sidebar">
      <div className="dash-sidebar-logo">
        <div className="dash-sidebar-avatar">{getUserInitials()}</div>
        <div className="dash-sidebar-brand">TOKDAK</div>
        <div className="dash-sidebar-tagline">ADMIN PORTAL</div>
      </div>

      <nav className="dash-nav">
        {navItems.map(({ key, label, icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <div
              key={key}
              className={`dash-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span>{icon}</span> {label}
            </div>
          );
        })}
      </nav>

      <div className="dash-sidebar-footer">
        <button className="dash-sidebar-signout" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;