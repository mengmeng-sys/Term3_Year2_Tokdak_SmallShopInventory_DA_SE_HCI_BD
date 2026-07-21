import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import alertService from '../../services/alertService';

export default function Topbar({ title }) {
  const { user, getAvatarUrl } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = getAvatarUrl();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'C';

  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await alertService.getAll();
        if (!cancelled) {
          const data = res?.data?.data || res?.data || [];
          setAlertCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {
        if (!cancelled) setAlertCount(0);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <div className="dash-topbar">
      <div className="dash-topbar-title">{title}</div>
      <div className="dash-topbar-actions">
        <div
          className="dash-topbar-bell"
          onClick={() => navigate('/client/alerts')}
          title="Alerts"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {alertCount > 0 && (
            <span className="dash-topbar-bell-badge">{alertCount > 99 ? '99+' : alertCount}</span>
          )}
        </div>
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
