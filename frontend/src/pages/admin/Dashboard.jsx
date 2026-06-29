import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import dashboardService from '../../services/dashboardService';
import shopService from '../../services/shopService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/adminDashboard.css';

const PAGE_SIZE = 5;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShops: 0,
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
  });
  const [shops, setShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadDashboardData = async () => {
    const response = await dashboardService.getAdminDashboard();
    if (!mountedRef.current) return;
    const data = response?.data?.data || response?.data || {};
    setStats({
      totalShops: data.total_shops || 0,
      totalClients: data.total_clients || 0,
      activeClients: data.active_clients || 0,
      inactiveClients: (data.total_clients || 0) - (data.active_clients || 0),
    });
    const recentShops = data.recent_shops || [];
    setShops(recentShops);
    setCurrentPage(1);
    setTotalPages(Math.ceil((data.total_shops || 0) / PAGE_SIZE));
  };

  const fetchShopsPage = async (page) => {
    const response = await shopService.getAll(page, PAGE_SIZE);
    if (!mountedRef.current) return;
    const body = response?.data?.data || response?.data || {};
    const rows = body.rows || [];
    setShops(rows);
    setCurrentPage(page);
    setTotalPages(Math.ceil((body.total || 0) / PAGE_SIZE));
  };

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        setLoading(true);
        await loadDashboardData();
      } catch (err) {
        if (!mountedRef.current) return;
        console.error('Error loading dashboard data:', err);
        setStats({ totalShops: 0, totalClients: 0, activeClients: 0, inactiveClients: 0 });
        setShops([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();
    return () => { mountedRef.current = false; };
  }, []);

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    try {
      setLoading(true);
      if (page === 1) {
        await loadDashboardData();
      } else {
        await fetchShopsPage(page);
      }
    } catch (err) {
      console.error('Error fetching page:', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <AdminSidebar />

      <div className="dash-main">
        <div className="dash-topbar">
          <div className="dash-topbar-title">Dashboard Overview</div>
          <div className="dash-topbar-actions">
            <div className="dash-topbar-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
            </div>
            <span className="dash-topbar-name">{user?.name || 'Admin'}</span>
          </div>
        </div>

        <div className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">System Statistics</h1>
              <p className="dash-page-subtitle">Real-time overview of your retail ecosystem.</p>
            </div>
            <button className="dash-btn-primary" onClick={() => navigate('/admin/shops/add')}>
              + Add New Shop
            </button>
          </div>

          <div className="dash-stats-grid">
            {[
              { label: 'TOTAL SHOPS', value: formatNumber(stats.totalShops), accent: '#ff6b00' },
              { label: 'TOTAL CLIENTS', value: formatNumber(stats.totalClients), accent: '#ff6b00' },
              { label: 'ACTIVE CLIENTS', value: formatNumber(stats.activeClients), accent: '#22c55e' },
              { label: 'INACTIVE CLIENTS', value: formatNumber(stats.inactiveClients), accent: '#ef4444' },
            ].map((item, i) => (
              <div key={i} className="dash-stat-card" style={{ borderLeftColor: item.accent }}>
                <p className="dash-stat-label">{item.label}</p>
                <div className="dash-stat-value-wrap">
                  <span className="dash-stat-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-table-section">
            <div className="dash-table-header">
              <h2 className="dash-table-title">
                {currentPage === 1 ? 'Recently Registered Shops' : `Shops - Page ${currentPage}`}
              </h2>
              <button onClick={() => navigate('/admin/shops')} className="dash-table-viewall">
                View All
              </button>
            </div>

            <div className="dash-table-container">
              <div className="dash-col-header-row">
                {['SHOP NAME', 'OWNER', 'PHONE', 'REGISTERED', 'STATUS'].map((h, i) => (
                  <div key={h} className="dash-col-header">{h}</div>
                ))}
              </div>

              {shops.length > 0 ? (
                shops.map((shop, i) => (
                  <div key={shop.shop_id || i} className={`dash-row ${i % 2 === 1 ? 'alt' : ''}`}>
                    <div className="dash-cell bold">
                      <span className="dash-shop-link" onClick={() => navigate(`/admin/shops/${shop.shop_id}`)}>
                        {shop.shop_name}
                      </span>
                    </div>
                    <div className="dash-cell">{shop.owner_name || 'N/A'}</div>
                    <div className="dash-cell">{shop.phone || 'N/A'}</div>
                    <div className="dash-cell">{formatDate(shop.created_at)}</div>
                    <div className="dash-cell">
                      <span
                        className="dash-badge"
                        style={{
                          backgroundColor: shop.active ? '#e8f5e9' : '#ffebee',
                          color: shop.active ? '#2e7d32' : '#c62828',
                        }}
                      >
                        {shop.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dash-empty-state">No shops registered yet</div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="dash-pagination">
                <span className="dash-pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="dash-pagination-buttons">
                  <button
                    className="dash-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lsaquo;
                  </button>
                  <span className="dash-page-btn active">{currentPage}</span>
                  <button
                    className="dash-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
