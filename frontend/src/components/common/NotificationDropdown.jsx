import { useState, useEffect, useRef, useCallback } from 'react';
import alertService from '../../services/alertService';

function BellIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M16 17H0v-2l2-2V8c0-3.31 2.69-6 6-6s6 2.69 6 6v5l2 2v2zM8 20a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z" fill="currentColor"/>
    </svg>
  );
}

const ACTION_LABELS = {
  create_user: 'Created user',
  delete_user: 'Deleted user',
  update_user: 'Updated user',
  toggle_user_status: 'Changed user status',
  create_backup: 'Created backup',
  delete_backup: 'Deleted backup',
  change_password: 'Changed password'
};

const ACTION_COLORS = {
  create_user: '#16a34a',
  delete_user: '#ba1a1a',
  update_user: '#2563eb',
  toggle_user_status: '#9333ea',
  create_backup: '#0891b2',
  delete_backup: '#ba1a1a',
  change_password: '#ca8a04'
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({ total_unread: 0, activities: [] });
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await alertService.getAdminNotifications();
      const data = res?.data?.data || {};
      setNotifications({
        total_unread: data.total_unread || 0,
        activities: data.activities || [],
      });
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasItems = notifications.activities.length > 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(v => !v); if (!open) fetchNotifications(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, position: 'relative', color: '#5f5e5e' }}
        aria-label="Notifications"
      >
        <BellIcon />
        {notifications.total_unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: '#ff6b00'
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          width: 340, maxHeight: 420, overflowY: 'auto',
          background: '#fff', border: '1px solid #e2bfb0', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 1000,
          padding: 0
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0eeed', fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>
            Admin Activity
            {notifications.total_unread > 0 && (
              <span style={{ marginLeft: 8, fontSize: 11, color: '#fff', background: '#ff6b00', borderRadius: 10, padding: '1px 8px' }}>
                {notifications.total_unread}
              </span>
            )}
          </div>

          {loading && !hasItems && (
            <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>Loading...</div>
          )}

          {!loading && !hasItems && (
            <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>No admin activity yet</div>
          )}

          {notifications.activities.length > 0 && (
            <div style={{ padding: '8px 0' }}>
              {notifications.activities.map(a => (
                <div key={`act-${a.activity_id}`} style={{ display: 'flex', gap: 10, padding: '8px 16px', alignItems: 'flex-start', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: ACTION_COLORS[a.action_type] || '#888',
                    marginTop: 6, flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>
                      {ACTION_LABELS[a.action_type] || a.action_type}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {a.admin_name && <span style={{ fontWeight: 500 }}>{a.admin_name}</span>}
                      {a.target_name && <> &rarr; {a.target_name}</>}
                      {a.details && <span style={{ color: '#999' }}> ({a.details})</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{formatTimeAgo(a.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0eeed', textAlign: 'center' }}>
            <button
              onClick={fetchNotifications}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ff6b00', fontWeight: 500 }}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;