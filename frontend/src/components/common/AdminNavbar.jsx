// frontend/src/components/admin/AdminNavbar.jsx
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = ({ 
  title = 'Dashboard',
  showNotification = true,
  onNotificationClick,
  rightContent
}) => {
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user?.name) return 'A';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className="h-16 flex items-center justify-between px-6 bg-[#fbf9f8] sticky top-0 z-10"
      style={{ borderBottom: '1px solid #e2bfb0' }}
    >
      <span className="font-semibold text-[#a04100] text-lg">{title}</span>
      
      <div className="flex items-center gap-4">
        {rightContent}
        
        {showNotification && (
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 rounded hover:bg-gray-100 transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '20px' }}>🔔</span>
            <span 
              className="absolute top-0 right-0 size-2 rounded-full"
              style={{ backgroundColor: '#ff6b00' }}
            />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <div 
            className="rounded-full size-8 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: '#ff6b00' }}
          >
            {getUserInitials()}
          </div>
          <span className="text-[#1A1A1A] text-sm font-medium hidden sm:block">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;