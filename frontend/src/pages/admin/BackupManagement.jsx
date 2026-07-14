import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import backupService from '../../services/backupService';
import shopService from '../../services/shopService';
import '../../styles/backupManagement.css';

const PAGE_SIZE = 10;

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 0a.5.5 0 0 0-.5.5v.77a5.5 5.5 0 0 0-1.1.48L4.46.9a.5.5 0 0 0-.7.07L2.22 2.95a.5.5 0 0 0 .07.7l.84.66a5.5 5.5 0 0 0-.47 1.1H1.5a.5.5 0 0 0-.5.5v2.18a.5.5 0 0 0 .5.5h.77a5.5 5.5 0 0 0 .48 1.1l-.84.66a.5.5 0 0 0-.07.7L3.76 12.8a.5.5 0 0 0 .7.07l.66-.84a5.5 5.5 0 0 0 1.1.48v.77a.5.5 0 0 0 .5.5h2.18a.5.5 0 0 0 .5-.5v-.77a5.5 5.5 0 0 0 1.1-.48l.66.84a.5.5 0 0 0 .7-.07l1.54-1.92a.5.5 0 0 0-.07-.7l-.84-.66a5.5 5.5 0 0 0 .48-1.1h.77a.5.5 0 0 0 .5-.5V5.82a.5.5 0 0 0-.5-.5h-.77a5.5 5.5 0 0 0-.48-1.1l.84-.66a.5.5 0 0 0 .07-.7L12.8 1.24a.5.5 0 0 0-.7-.07l-.66.84a5.5 5.5 0 0 0-1.1-.48V.5A.5.5 0 0 0 9.68 0H7.5H7zm.5 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#1c1b1b"/>
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
      <path d="M12.5 5.03A5.5 5.5 0 0 0 2.06 5.03 4 4 0 0 0 4 13h8.5a3.5 3.5 0 0 0 .5-6.97h-.5zM8 5.5l3 3H9.5V11h-3V8.5H5l3-3z" fill="white"/>
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M15 3C9.48 3 5 5.24 5 8v14c0 2.76 4.48 5 10 5s10-2.24 10-5V8c0-2.76-4.48-5-10-5zm0 2c4.42 0 8 1.82 8 3s-3.58 3-8 3-8-1.82-8-3 3.58-3 8-3zm0 18c-4.42 0-8-1.82-8-3v-3.36c1.92 1.36 4.92 2.36 8 2.36s6.08-1 8-2.36V20c0 1.18-3.58 3-8 3zm0-6c-4.42 0-8-1.82-8-3v-3.36c1.92 1.36 4.92 2.36 8 2.36s6.08-1 8-2.36V14c0 1.18-3.58 3-8 3z" fill="#a04100"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
      <path d="M17 2C8.72 2 2 8.72 2 17s6.72 15 15 15 15-6.72 15-15S25.28 2 17 2zm-2 22l-7-7 2.12-2.12L15 19.76l9.88-9.88L27 12l-12 12z" fill="#a04100"/>
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg width="30" height="22" viewBox="0 0 36 22" fill="none">
      <path d="M34 0H2C.9 0 0 .9 0 2v18c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm-4 14H6v-2h24v2zm0-4H6V8h24v2zm0-4H6V4h24v2z" fill="#a04100"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="30" height="26" viewBox="0 0 36 26" fill="none">
      <path d="M18 0L0 26h36L18 0zm-2 10h4v6h-4v-6zm0 8h4v4h-4v-4z" fill="#ba1a1a"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M9 0H2C.9 0 0 .9 0 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7H9V0zm1 0v6h6l-6-6z" fill="#5f5e5e"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 0a1 1 0 0 0-1 1v7.59L4.46 6.05A1 1 0 0 0 3.05 7.46l4.24 4.24a1 1 0 0 0 1.42 0l4.24-4.24a1 1 0 0 0-1.41-1.41L9 8.59V1a1 1 0 0 0-1-1zM1 14a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2H1z" fill="#5f5e5e"/>
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.96 2.04A8 8 0 1 1 3.05 12.95a1 1 0 0 1 1.41-1.41A6 6 0 1 0 12.95 3.05l-1.5 1.5A1 1 0 0 1 10 3.83V0h3.83a1 1 0 0 1 .7 1.71l-.57.33z" fill="#5f5e5e"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="#ff6b00"/>
    </svg>
  );
}

function CloudEmptyIcon() {
  return (
    <svg width="58" height="52" viewBox="0 0 58 52" fill="none">
      <path d="M45.5 20.11A12.5 12.5 0 0 0 21.11 17.6 9 9 0 0 0 22 35h23a8 8 0 0 0 .5-14.89zM29 23l6 6h-4v6h-4v-6h-4l6-6z" fill="#c8c6c5"/>
    </svg>
  );
}

function formatBytes(bytes) {
  const num = Number(bytes);
  if (!num) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = num;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} \u00B7 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusClass(s) {
  return s === 'success' ? 'success' : s === 'failed' ? 'failed' : 'running';
}

const BackupManagement = () => {
  const { user } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState({ total: 0, success_count: 0, failed_24h: 0, total_storage: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [triggering, setTriggering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('all');

  const fetchBackups = async (page) => {
    const res = await backupService.getAll(page, PAGE_SIZE);
    const body = res?.data?.data || res?.data || {};
    const rows = body.rows || [];
    setBackups(rows);
    setCurrentPage(page);
    setTotalPages(Math.ceil((body.total || 0) / PAGE_SIZE));
  };

  const fetchStats = async () => {
    const res = await backupService.getStats();
    const data = res?.data?.data || {};
    setStats(prev => ({ ...prev, ...data }));
  };

  const fetchShops = async () => {
    try {
      const res = await shopService.getAll(1, 200);
      const body = res?.data?.data || res?.data || {};
      const rows = body.rows || [];
      setShops(rows);
    } catch (err) {
      console.error('Error fetching shops:', err);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchBackups(1), fetchStats(), fetchShops()]);
      } catch (err) {
        console.error('Error loading backups:', err);
        setBackups([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();
    return () => { mountedRef.current = false; };
  }, []);

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    try {
      await fetchBackups(page);
    } catch (err) {
      console.error('Error fetching page:', err);
    }
  };

  const triggerBackup = async () => {
    if (triggering) return;
    setTriggering(true);

    const targets = selectedShopId === 'all' ? shops : shops.filter(s => s.shop_id === Number(selectedShopId));
    if (targets.length === 0) {
      setToastMsg('No shops available for backup');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTriggering(false);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const shop of targets) {
      try {
        await backupService.create({
          shop_id: shop.shop_id,
          user_id: user?.user_id || 1,
          note: selectedShopId === 'all' ? `Bulk backup for ${shop.shop_name}` : 'Manual backup triggered from admin panel',
        });
        successCount++;
      } catch (err) {
        console.error(`Backup failed for shop #${shop.shop_id}:`, err);
        failCount++;
      }
    }

    const msg = targets.length === 1
      ? (successCount > 0 ? 'Backup initiated successfully' : 'Failed to trigger backup')
      : `Backup complete: ${successCount} succeeded, ${failCount} failed`;
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    await Promise.all([fetchBackups(1), fetchStats()]);
    setTriggering(false);
  };

  const downloadBackup = async (backup) => {
    try {
      const res = await backupService.download(backup.backup_id);
      const blob = new Blob([res.data], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.file_name || `backup_${backup.backup_id}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToastMsg('Backup file downloaded');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error downloading backup:', err);
      setToastMsg('Backup file not available on server');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  const retryBackup = async (backup) => {
    if (triggering) return;
    setTriggering(true);
    try {
      await backupService.create({
        shop_id: backup.shop_id,
        user_id: user?.user_id || 1,
        note: `Retry of backup #${backup.backup_id}`,
      });
      setToastMsg('Retry backup initiated');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      await Promise.all([fetchBackups(1), fetchStats()]);
    } catch (err) {
      console.error('Error retrying backup:', err);
      setToastMsg('Failed to retry backup');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setTriggering(false);
    }
  };

  const deleteBackup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) return;
    try {
      await backupService.remove(id);
      setToastMsg('Backup deleted');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      await Promise.all([fetchBackups(currentPage), fetchStats()]);
    } catch (err) {
      console.error('Error deleting backup:', err);
    }
  };

  const successRate = stats.total > 0
    ? ((stats.success_count / stats.total) * 100).toFixed(1) + '%'
    : '0%';

  const buildPaginationItems = () => {
    const items = [];
    items.push('\u2039');
    for (let i = 1; i <= Math.min(3, totalPages); i++) items.push(String(i));
    if (totalPages > 4) items.push('\u2026');
    if (totalPages > 3) items.push(String(totalPages));
    items.push('\u203A');
    return items;
  };

  if (loading) {
    return (
      <div className="bm-loading">
        <div className="bm-spinner"></div>
        <p>Loading backups...</p>
      </div>
    );
  }

  return (
    <div className="bm-page">
      <AdminSidebar />

      <div className="bm-main">
        <div className="bm-topbar">
          <span className="bm-topbar-title">Backup Management</span>
          <div className="bm-topbar-right" style={{ position: 'relative' }}>
            <NotificationDropdown />
            <div style={{ position: 'relative' }}>
              <button className="bm-settings-btn" onClick={() => { setShowSettings(v => !v); setShowNotif(false); }}>
                <SettingsIcon />
              </button>
              {showSettings && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 220, background: '#fff', border: '1px solid #e2bfb0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, padding: 12 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Backup Settings</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    Auto-backup enabled
                  </label>
                </div>
              )}
            </div>
            <div className="bm-topbar-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
            </div>
          </div>
        </div>

        <div className="bm-content">
          <div className="bm-action-header">
            <p className="bm-subtitle">Manage and monitor database snapshots for all merchant shops.</p>
            <div className="bm-trigger-row" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <select
                className="bm-shop-select"
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d4d2d0', fontSize: 13, background: '#fff', minWidth: 180 }}
              >
                <option value="all">All Shops</option>
                {shops.map((s) => (
                  <option key={s.shop_id} value={s.shop_id}>{s.shop_name}</option>
                ))}
              </select>
              <button className="bm-btn-trigger" onClick={triggerBackup} disabled={triggering}>
                <CloudUploadIcon />
                {triggering ? 'Triggering...' : 'Trigger New Backup'}
              </button>
            </div>
          </div>

          <div className="bm-stats-grid">
            <div className="bm-stat-card">
              <div className="bm-stat-label">TOTAL BACKUPS</div>
              <div className="bm-stat-row">
                <span className="bm-stat-value">{stats.total.toLocaleString()}</span>
                <DatabaseIcon />
              </div>
            </div>
            <div className="bm-stat-card">
              <div className="bm-stat-label">SUCCESS RATE</div>
              <div className="bm-stat-row">
                <span className="bm-stat-value">{successRate}</span>
                <CheckCircleIcon />
              </div>
            </div>
            <div className="bm-stat-card">
              <div className="bm-stat-label">STORAGE USED</div>
              <div className="bm-stat-row">
                <span className="bm-stat-value">{formatBytes(stats.total_storage)}</span>
                <StorageIcon />
              </div>
            </div>
            <div className="bm-stat-card">
              <div className="bm-stat-label">FAILED (24H)</div>
              <div className="bm-stat-row">
                <span className="bm-stat-value danger">{stats.failed_24h}</span>
                <AlertIcon />
              </div>
            </div>
          </div>

          <div className="bm-table-wrap">
            <div className="bm-col-header-row">
              {['File Name', 'Shop Name', 'File Size', 'Status', 'Date Created', 'Actions'].map((h, i) => (
                <div key={h} className={`bm-col-header${i === 5 ? ' right' : ''}`}>{h}</div>
              ))}
            </div>
            {backups.length > 0 ? (
              backups.map((b, i) => (
                <div key={b.backup_id} className="bm-row" style={{ backgroundColor: i % 2 === 1 ? '#fafafa' : 'white' }}>
                  <div className="bm-file-cell">
                    <FileIcon />
                    <span className="bm-file-name">{b.file_name}</span>
                  </div>
                  <div className="bm-cell">{b.shop_name || 'Unknown'}</div>
                  <div className="bm-cell">{formatBytes(b.file_size)}</div>
                  <div className="bm-cell">
                    <span className={`bm-badge ${statusClass(b.status)}`}>{b.status.toUpperCase()}</span>
                  </div>
                  <div className="bm-cell">{formatDate(b.created_at)}</div>
                  <div className="bm-cell" style={{ paddingRight: 24, display: 'flex', gap: 8 }}>
                    {b.status === 'success' ? (
                      <button className="bm-action-btn" onClick={() => downloadBackup(b)} title="Download backup">
                        <DownloadIcon />
                      </button>
                    ) : (
                      <button className="bm-action-btn" onClick={() => retryBackup(b)} title="Retry backup">
                        <RetryIcon />
                      </button>
                    )}
                    <button className="bm-action-btn" onClick={() => deleteBackup(b.backup_id)} title="Delete backup" style={{ color: '#ba1a1a' }}>
                      <svg width="14" height="14" viewBox="0 0 14 18" fill="none">
                        <path d="M3 0h8l1 2H2l1-2zM0 3h14v2H0V3zm2 3h10l-1 12H3L2 6zm3 3v6m4-6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : null}
            {totalPages > 1 && (
              <div className="bm-pagination">
                <span className="bm-pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="bm-pagination-btns">
                  {buildPaginationItems().map((p, idx) => {
                    const isNum = !isNaN(p) && p !== '\u2026' && p !== '\u2039' && p !== '\u203A';
                    const pageNum = isNum ? parseInt(p) : null;
                    const isActive = pageNum === currentPage;
                    const isNav = p === '\u2039' || p === '\u203A';
                    return (
                      <button
                        key={`${p}-${idx}`}
                        className={`bm-page-btn${isActive ? ' active' : ''}`}
                        onClick={() => {
                          if (isNav && p === '\u2039' && currentPage > 1) handlePageChange(currentPage - 1);
                          else if (isNav && p === '\u203A' && currentPage < totalPages) handlePageChange(currentPage + 1);
                          else if (pageNum) handlePageChange(pageNum);
                        }}
                        disabled={isNav && ((p === '\u2039' && currentPage === 1) || (p === '\u203A' && currentPage === totalPages))}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {backups.length === 0 && (
            <div className="bm-empty-state">
              <div className="bm-empty-icon">
                <CloudEmptyIcon />
              </div>
              <p className="bm-empty-title">No backups yet</p>
              <p className="bm-empty-desc">Trigger your first backup to start monitoring database snapshots.</p>
            </div>
          )}
        </div>

        <div className="bm-footer">TOKDAK RETAIL SYSTEMS &copy; 2023 &bull; SECURE CLOUD STORAGE ENABLED</div>
      </div>

      {showToast && (
        <div className="bm-toast">
          <CheckIcon />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default BackupManagement;
