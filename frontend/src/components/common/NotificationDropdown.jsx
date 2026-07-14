import { useState, useEffect, useRef, useCallback } from 'react';
import alertService from '../../services/alertService';

function BellIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M16 17H0v-2l2-2V8c0-3.31 2.69-6 6-6s6 2.69 6 6v5l2 2v2zM8 20a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z" fill="currentColor"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 0C3.13 0 0 3.13 0 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm1 11H6V9h2v2zm0-4H6V3h2v4z" fill="#ba1a1a"/>
    </svg>
  );
}

function FailedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="#ba1a1a" strokeWidth="1.3"/>
      <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="#ba1a1a" strokeWidth="1.3"/>
      <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="#ba1a1a" strokeWidth="1.3"/>
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L1 5v8h4v-4h4v4h4V5L7 1z" fill="#16a34a"/>
    </svg>
  );
}

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
  const [notifications, setNotifications] = useState({ total_unread: 0, alerts: [], failed_backups: [], new_shops_today: 0 });
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await alertService.getAdminNotifications();
      const data = res?.data?.data || {};
      setNotifications({
        total_unread: data.total_unread || 0,
        alerts: data.alerts || [],
        failed_backups: data.failed_backups || [],
        new_shops_today: data.new_shops_today || 0,
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

  const hasItems = notifications.alerts.length > 0 || notifications.failed_backups.length > 0 || notifications.new_shops_today > 0;

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
            Notifications
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
            <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>No new notifications</div>
          )}

          {notifications.alerts.length > 0 && (
            <div style={{ padding: '8px 0' }}>
              <div style={{ padding: '4px 16px', fontSize: 11, fontWeight: 600, color: '#ba1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Stock Alerts ({notifications.alerts.length})
              </div>
              {notifications.alerts.map(a => (
                <div key={`alert-${a.alert_id}`} style={{ display: 'flex', gap: 10, padding: '8px 16px', alignItems: 'flex-start', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ color: '#ba1a1a', marginTop: 2, flexShrink: 0 }}><AlertIcon /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{a.product_name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {a.shop_name} &middot; {a.type === 'low_stock' ? `Low stock (${a.current_quantity}/${a.min_quantity})` : 'Out of stock'}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{formatTimeAgo(a.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.failed_backups.length > 0 && (
            <div style={{ padding: '8px 0', borderTop: notifications.alerts.length > 0 ? '1px solid #f0eeed' : 'none' }}>
              <div style={{ padding: '4px 16px', fontSize: 11, fontWeight: 600, color: '#ba1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Failed Backups ({notifications.failed_backups.length})
              </div>
              {notifications.failed_backups.map(b => (
                <div key={`fb-${b.backup_id}`} style={{ display: 'flex', gap: 10, padding: '8px 16px', alignItems: 'flex-start', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ color: '#ba1a1a', marginTop: 2, flexShrink: 0 }}><FailedIcon /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{b.shop_name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{b.file_name}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{formatTimeAgo(b.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.new_shops_today > 0 && (
            <div style={{ padding: '8px 16px', borderTop: '1px solid #f0eeed', display: 'flex', gap: 10, alignItems: 'center' }}>
              <ShopIcon />
              <span style={{ fontSize: 13, color: '#1A1A1A' }}>{notifications.new_shops_today} new shop{notifications.new_shops_today > 1 ? 's' : ''} registered today</span>
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