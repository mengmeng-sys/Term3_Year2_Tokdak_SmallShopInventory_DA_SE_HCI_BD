import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title }) {
  const { user, getAvatarUrl } = useAuth();
  const avatarUrl = getAvatarUrl();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'C';

  return (
    <div className="dash-topbar">
      <div className="dash-topbar-title">{title}</div>
      <div className="dash-topbar-actions">
        <div className="dash-topbar-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
        </div>
        <span className="dash-topbar-name">{user?.name || 'Client'}</span>
      </div>
    </div>
  );
}
