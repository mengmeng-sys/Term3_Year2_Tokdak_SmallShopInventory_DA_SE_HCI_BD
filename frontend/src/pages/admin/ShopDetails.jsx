import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import shopService from '../../services/shopService';
import userService from '../../services/userService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/ShopDetail.css';

function ProductsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
    </svg>
  );
}

function AlertsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

const ShopDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const mountedRef = useRef(true);
  const [shop, setShop] = useState(null);
  const [owner, setOwner] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    alertsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!id) return;
    mountedRef.current = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await shopService.getDetails(id);
        if (!mountedRef.current) return;
        const data = response?.data?.data || {};
        setShop(data);
        setStats({
          totalProducts: data.total_products || 0,
          categoriesCount: data.categories_count || 0,
          alertsCount: data.alerts_count || 0,
        });

        if (data.user_id) {
          try {
            const userRes = await userService.getById(data.user_id);
            if (!mountedRef.current) return;
            const userData = userRes?.data?.data || userRes?.data || {};
            setOwner(userData);
          } catch {
            if (!mountedRef.current) return;
            setOwner({
              name: data.owner_name || 'N/A',
              email: data.owner_email || 'N/A',
              DOB: null,
              gender: null,
            });
          }
        }
      } catch (err) {
        if (!mountedRef.current) return;
        console.error('Error loading shop details:', err);
        setError('Failed to load shop details');
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    load();
    return () => { mountedRef.current = false; };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!shop || !shop.user_id) return;

    const willActivate = !shop.active;
    const label = willActivate ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${label} this shop?`)) return;

    try {
      setIsToggling(true);
      await userService.toggleStatus(shop.user_id, willActivate);
      setShop((prev) => ({ ...prev, active: willActivate }));
    } catch (err) {
      console.error('Error toggling shop status:', err);
      alert('Failed to update shop status. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this shop? This action cannot be undone!')) return;
    try {
      await shopService.remove(id);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete shop');
    }
  };

  const handleBack = () => navigate('/admin/dashboard');

  const isActive = shop?.active;

  if (loading) {
    return (
      <div className="sd-page">
        <AdminSidebar />
        <div className="sd-main">
          <div className="sd-topbar">
            <div className="sd-topbar-left">
              <span className="sd-topbar-title">Shop Details</span>
            </div>
            <div className="sd-topbar-right">
              <div className="sd-topbar-avatar">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
            </div>
          </div>
          <div className="sd-loading">
            <div className="sd-spinner"></div>
            <p>Loading shop details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sd-page">
        <AdminSidebar />
        <div className="sd-main">
          <div className="sd-topbar">
            <div className="sd-topbar-left">
              <span className="sd-topbar-title">Shop Details</span>
            </div>
            <div className="sd-topbar-right">
              <div className="sd-topbar-avatar">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
            </div>
          </div>
          <div className="sd-error">
            <p>{error}</p>
            <button onClick={handleBack} className="sd-btn-primary">Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <AdminSidebar />

      <div className="sd-main">
        <div className="sd-topbar">
          <div className="sd-topbar-left">
            <button className="sd-back-btn" onClick={handleBack}>
              <BackArrow />
              <span>Back</span>
            </button>
            <span className="sd-topbar-title">Shop Details</span>
          </div>
          <div className="sd-topbar-right">
            <div className="sd-topbar-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
            </div>
          </div>
        </div>

        <div className="sd-content">
          <div className="sd-info-grid">
            <div className="sd-card">
              <div className="sd-card-heading">
                <div className="sd-card-title">Shop Info</div>
                <span className="sd-card-id">ID: #{shop?.shop_id || 'N/A'}</span>
              </div>
              <div className="sd-fields">
                <div>
                  <p className="sd-field-label">SHOP NAME</p>
                  <p className="sd-field-value semibold">{shop?.shop_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="sd-field-label">ADDRESS</p>
                  <p className="sd-field-value">{shop?.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="sd-field-label">CONTACT NUMBER</p>
                  <p className="sd-field-value">{shop?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="sd-field-label">JOIN DATE</p>
                  <p className="sd-field-value">{formatDate(shop?.created_at)}</p>
                </div>
                <div>
                  <p className="sd-field-label">STATUS</p>
                  <span
                    className="sd-badge"
                    style={{
                      backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
                      color: isActive ? '#2e7d32' : '#c62828',
                    }}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="sd-card">
              <div className="sd-card-heading">
                <div className="sd-card-title">Owner Info</div>
                <span className="sd-role-badge">CLIENT</span>
              </div>

              <div className="sd-owner-photo-row">
                <div className="sd-owner-photo">
                  <span className="sd-owner-initials">
                    {owner?.name
                      ? owner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : '?'}
                  </span>
                </div>
                <div className="sd-owner-meta">
                  <div>
                    <p className="sd-field-label">FULL NAME</p>
                    <p className="sd-field-value semibold">{owner?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="sd-field-label">EMAIL</p>
                    <p className="sd-field-value">{owner?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="sd-two-col">
                <div>
                  <p className="sd-field-label">DATE OF BIRTH</p>
                  <p className="sd-field-value">{owner?.DOB ? formatDate(owner.DOB) : 'N/A'}</p>
                </div>
                <div>
                  <p className="sd-field-label">GENDER</p>
                  <p className="sd-field-value">{owner?.gender || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sd-status-card">
            <div className="sd-status-left">
              <div className="sd-status-icon">📍</div>
              <div>
                <p className="sd-status-label">Operational Status</p>
                <p className="sd-status-desc">Manage the shop owner account status.</p>
              </div>
            </div>
            <div className="sd-status-right">
              <span className={`sd-active-badge ${isActive ? 'active' : 'inactive'}`}>
                <span className="sd-active-dot" />
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <div>
                <span className="sd-toggle-label">TOGGLE STATUS</span>
                <div
                  className={`sd-toggle ${isActive ? 'active' : 'inactive'}`}
                  onClick={handleToggleStatus}
                  style={{ cursor: isToggling ? 'not-allowed' : 'pointer', opacity: isToggling ? 0.6 : 1 }}
                >
                  <div className="sd-toggle-thumb" />
                </div>
              </div>
            </div>
          </div>

          <div className="sd-stats-grid">
            <div className="sd-stat-card">
              <div className="sd-stat-icon-box" style={{ backgroundColor: 'rgba(255,107,0,0.12)', color: '#e85f00' }}>
                <ProductsIcon />
              </div>
              <div className="sd-stat-info">
                <p className="sd-stat-label">TOTAL PRODUCTS</p>
                <p className="sd-stat-value">{stats.totalProducts}</p>
              </div>
            </div>
            <div className="sd-stat-card">
              <div className="sd-stat-icon-box" style={{ backgroundColor: 'rgba(33,150,243,0.12)', color: '#1565c0' }}>
                <CategoriesIcon />
              </div>
              <div className="sd-stat-info">
                <p className="sd-stat-label">CATEGORIES</p>
                <p className="sd-stat-value">{stats.categoriesCount}</p>
              </div>
            </div>
            <div className="sd-stat-card">
              <div className="sd-stat-icon-box" style={{ backgroundColor: 'rgba(239,83,80,0.12)', color: '#d32f2f' }}>
                <AlertsIcon />
              </div>
              <div className="sd-stat-info">
                <p className="sd-stat-label">UNRESOLVED ALERTS</p>
                <p className="sd-stat-value">{stats.alertsCount}</p>
              </div>
            </div>
          </div>

          <div className="sd-bottom-actions">
            <button className="sd-btn-download" onClick={() => alert('Download report feature coming soon!')}>
              Download Report
            </button>
            <button className="sd-btn-delete" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
