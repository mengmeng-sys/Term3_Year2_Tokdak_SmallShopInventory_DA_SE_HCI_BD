// frontend/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import dashboardService from '../../services/dashboardService';
import shopService from '../../services/shopService';
import userService from '../../services/userService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShops: 0,
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
  });
  const [recentShops, setRecentShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalShopsCount, setTotalShopsCount] = useState(0);
  const [itemsPerPage] = useState(5);
  const [usersMap, setUsersMap] = useState({});
  const [isOnDashboardPage, setIsOnDashboardPage] = useState(true);

  // Fetch users to map user_id to owner_name
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll();
        const users = response?.data?.data || response?.data || [];
        const map = {};
        users.forEach(u => {
          map[u.user_id || u.id] = u.name || u.owner_name || 'Unknown';
        });
        setUsersMap(map);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Format shop data consistently
  const formatShopData = (shop) => {
    const ownerName = shop.owner_name || 
                      usersMap[shop.user_id] || 
                      shop.owner || 
                      shop.ownerName || 
                      'N/A';
    
    return {
      shop_id: shop.shop_id || shop.id,
      shop_name: shop.shop_name || shop.name || 'Unnamed Shop',
      owner_name: ownerName,
      phone: shop.phone || 'N/A',
      created_at: shop.created_at || shop.createdAt || shop.date,
      status: shop.status || 'active'
    };
  };

  // Load initial dashboard data (Page 1 - Recent Shops)
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const response = await dashboardService.getAdminDashboard();
      const data = response?.data?.data || response?.data || {};
      
      setStats({
        totalShops: data.total_shops || 0,
        totalClients: data.total_clients || 0,
        activeClients: data.active_clients || 0,
        inactiveClients: (data.total_clients || 0) - (data.active_clients || 0),
      });

      setTotalShopsCount(data.total_shops || 0);
      setTotalPages(Math.ceil((data.total_shops || 0) / itemsPerPage));

      const shops = data.recent_shops || [];
      const formattedShops = shops.map(formatShopData);
      setRecentShops(formattedShops);
      setCurrentPage(1);
      setIsOnDashboardPage(true);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setStats({
        totalShops: 0,
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
      });
      setRecentShops([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shops by page
  const fetchShopsByPage = async (page) => {
    try {
      setLoading(true);
      const response = await shopService.getAll(page, itemsPerPage);
      
      let shops = [];
      let total = 0;
      
      if (response?.data?.data) {
        const responseData = response.data.data;
        if (Array.isArray(responseData)) {
          shops = responseData;
          total = shops.length;
        } else {
          shops = responseData.shops || responseData.rows || [];
          total = responseData.total || responseData.count || shops.length;
        }
      } else if (response?.data) {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          shops = responseData;
          total = shops.length;
        } else {
          shops = responseData.shops || responseData.rows || [];
          total = responseData.total || responseData.count || shops.length;
        }
      } else if (Array.isArray(response)) {
        shops = response;
        total = shops.length;
      } else {
        shops = response?.shops || response?.rows || [];
        total = response?.total || response?.count || shops.length;
      }
      
      const formattedShops = shops.map(formatShopData);
      setRecentShops(formattedShops);
      setCurrentPage(page);
      setIsOnDashboardPage(false);
      
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page === 1) {
      loadDashboardData();
    } else if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchShopsByPage(page);
    }
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'active': { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
      'pending': { bg: '#fff3e0', color: '#ef6c00', label: 'Pending' },
      'inactive': { bg: '#ffebee', color: '#c62828', label: 'Inactive' },
    };
    return statusMap[status?.toLowerCase()] || { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' };
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
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

      {/* Main Content */}
      <div className="dash-main">
        {/* Top Bar */}
        <div className="dash-topbar">
          <div className="dash-topbar-title">Dashboard Overview</div>
          <div className="dash-topbar-actions">
            <button className="dash-notif-btn">🔔</button>
            <div className="dash-topbar-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
            </div>
            <span className="dash-topbar-name">{user?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="dash-content">
          {/* Page Header */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">System Statistics</h1>
              <p className="dash-page-subtitle">Real-time overview of your retail ecosystem.</p>
            </div>
            <button className="dash-btn-primary" onClick={() => navigate('/admin/shops/add')}>
              + Add New Shop
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="dash-stats-grid">
            {[
              { 
                label: "TOTAL SHOPS", 
                value: formatNumber(stats.totalShops), 
                badge: stats.totalShops > 0 ? `+${stats.totalShops}` : '0', 
                badgeColor: '#a04100', 
                accent: '#ff6b00' 
              },
              { 
                label: "TOTAL CLIENTS", 
                value: formatNumber(stats.totalClients), 
                badge: stats.totalClients > 0 ? `+${stats.totalClients}` : '0', 
                badgeColor: '#a04100', 
                accent: '#ff6b00' 
              },
              { 
                label: "ACTIVE CLIENTS", 
                value: formatNumber(stats.activeClients), 
                badge: stats.totalClients > 0 ? `${Math.round((stats.activeClients / stats.totalClients) * 100)}%` : '0%', 
                badgeColor: '#4caf50', 
                accent: 'rgba(226,191,176,0.3)' 
              },
              { 
                label: "INACTIVE CLIENTS", 
                value: formatNumber(stats.inactiveClients), 
                badge: stats.totalClients > 0 ? `${Math.round((stats.inactiveClients / stats.totalClients) * 100)}%` : '0%', 
                badgeColor: '#ba1a1a', 
                accent: 'rgba(226,191,176,0.3)' 
              },
            ].map((item, i) => (
              <div key={i} className="dash-stat-card" style={{ borderLeftColor: item.accent }}>
                <p className="dash-stat-label">{item.label}</p>
                <div className="dash-stat-value-wrap">
                  <span className="dash-stat-value">{item.value}</span>
                  <span className="dash-stat-badge" style={{ color: item.badgeColor }}>{item.badge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Registered Shops */}
          <div className="dash-table-section">
            <div className="dash-table-header">
              <h2 className="dash-table-title">
                {isOnDashboardPage ? 'Recently Registered Shops' : `Shops - Page ${currentPage}`}
              </h2>
              <button onClick={() => navigate('/admin/shops')} className="dash-table-viewall">
                View All →
              </button>
            </div>

            <div className="dash-table-container">
              <div className="dash-col-header-row">
                {["SHOP NAME", "OWNER NAME", "PHONE", "DATE REGISTERED", "STATUS", "ACTION"].map((h, i) => (
                  <div key={i} className={`dash-col-header ${i === 5 ? 'right' : ''}`}>{h}</div>
                ))}
              </div>

              {recentShops.length > 0 ? (
                recentShops.map((shop, i) => {
                  const st = getStatusStyle(shop.status);
                  
                  return (
                    <div key={shop.shop_id || i} className={`dash-row ${i % 2 === 1 ? 'alt' : ''}`}>
                      <div className="dash-cell bold">{shop.shop_name}</div>
                      <div className="dash-cell">{shop.owner_name}</div>
                      <div className="dash-cell">{shop.phone}</div>
                      <div className="dash-cell">{formatDate(shop.created_at)}</div>
                      <div className="dash-cell">
                        <span className="dash-badge" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      <div className="dash-cell right">
                        <button 
                          className="dash-btn-view"
                          onClick={() => navigate(`/admin/shops/${shop.shop_id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="dash-empty-state">No shops registered yet</div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="dash-pagination">
                <span className="dash-pagination-info">
                  Showing {recentShops.length} of {formatNumber(totalShopsCount)} registrations
                </span>
                <div className="dash-pagination-buttons">
                  <button 
                    className="dash-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`dash-page-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={typeof page !== 'number'}
                      style={typeof page !== 'number' ? { cursor: 'default' } : {}}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    className="dash-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="dash-footer">
          © {new Date().getFullYear()} TOKDAK Operations. System v2.4.1 — High Reliability Retail Core.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;