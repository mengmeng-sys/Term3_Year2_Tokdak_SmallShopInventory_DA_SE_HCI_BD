// frontend/src/pages/admin/ShopDetail.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import shopService from '../../services/shopService';
import userService from '../../services/userService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import stockService from '../../services/stockService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/ShopDetail.css';

const ShopDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();

  const [shop, setShop] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    transactionsCount: 0,
  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch shop details
        const shopResponse = await shopService.getById(id);
        const shopData = shopResponse?.data?.data || shopResponse?.data || {};
        setShop(shopData);

        // Fetch shop statistics
        try {
          // Get products for this shop
          const productsResponse = await productService.getAll({ shop_id: id });
          const products = productsResponse?.data?.data || productsResponse?.data || [];
          
          // Get categories for this shop
          const categoriesResponse = await categoryService.getAll({ shop_id: id });
          const categories = categoriesResponse?.data?.data || categoriesResponse?.data || [];
          
          // Get stock history for this shop
          const historyResponse = await stockService.getShopHistory(id);
          const history = historyResponse?.data?.data || historyResponse?.data || [];

          setStats({
            totalProducts: products.length || shopData.total_products || 0,
            categoriesCount: categories.length || shopData.categories_count || 0,
            transactionsCount: history.length || shopData.transactions_count || 0,
          });
        } catch (err) {
          console.error('Error fetching shop stats:', err);
          setStats({
            totalProducts: shopData.total_products || 0,
            categoriesCount: shopData.categories_count || 0,
            transactionsCount: shopData.transactions_count || 0,
          });
        }

        // Fetch owner details if user_id exists
        if (shopData.user_id) {
          try {
            const userResponse = await userService.getById(shopData.user_id);
            const userData = userResponse?.data?.data || userResponse?.data || {};
            setOwner(userData);
          } catch (err) {
            console.error('Error fetching owner:', err);
            setOwner({
              name: shopData.owner_name || 'N/A',
              email: shopData.owner_email || 'N/A',
            });
          }
        } else {
          setOwner({
            name: shopData.owner_name || 'N/A',
            email: shopData.owner_email || 'N/A',
          });
        }

      } catch (err) {
        console.error('Error fetching shop:', err);
        setError('Failed to load shop details');
        // Fallback data
        setShop({
          shop_id: id || 'N/A',
          shop_name: 'Unnamed Shop',
          address: 'N/A',
          phone: 'N/A',
          created_at: new Date().toISOString(),
          status: 'active',
        });
        setOwner({
          name: 'N/A',
          email: 'N/A',
        });
        setStats({
          totalProducts: 0,
          categoriesCount: 0,
          transactionsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShopData();
    }
  }, [id]);

  // Handle toggle shop status
  const handleToggleStatus = async () => {
    if (!shop) return;
    
    const newStatus = shop.status?.toLowerCase() === 'active' ? 'inactive' : 'active';
    
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this shop?`)) {
      try {
        setIsToggling(true);
        
        // Update shop status via API
        const response = await shopService.update(id, { 
          status: newStatus 
        });
        
        // Update local state
        const updatedShop = response?.data?.data || response?.data || {};
        setShop({
          ...shop,
          status: updatedShop.status || newStatus,
        });
        
        // Show success message
        alert(`Shop ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        
      } catch (err) {
        console.error('Error updating shop status:', err);
        alert('Failed to update shop status. Please try again.');
      } finally {
        setIsToggling(false);
      }
    }
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'active': { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
      'pending': { bg: '#fff3e0', color: '#ef6c00', label: 'Pending' },
      'inactive': { bg: '#ffebee', color: '#c62828', label: 'Inactive' },
    };
    return statusMap[status?.toLowerCase()] || statusMap['active'];
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

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
              <div className="sd-notif-wrap">🔔</div>
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
              <div className="sd-notif-wrap">🔔</div>
              <div className="sd-topbar-avatar">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
            </div>
          </div>
          <div className="sd-error">
            <p>{error}</p>
            <button onClick={handleBack} className="sd-btn-primary">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusStyle(shop?.status);
  const isActive = shop?.status?.toLowerCase() === 'active';

  return (
    <div className="sd-page">
      <AdminSidebar />

      {/* Main Content */}
      <div className="sd-main">
        {/* Top Bar */}
        <div className="sd-topbar">
          <div className="sd-topbar-left">
            <button className="sd-back-btn" onClick={handleBack}>
              ←
            </button>
            <span className="sd-topbar-title">Shop Details</span>
          </div>
          <div className="sd-topbar-right">
            <div className="sd-notif-wrap">🔔</div>
            <div className="sd-topbar-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
            </div>
          </div>
        </div>

        <div className="sd-content">
          {/* Shop Info Grid */}
          <div className="sd-info-grid">
            {/* Shop Info Card */}
            <div className="sd-card">
              <div className="sd-card-heading">
                <div className="sd-card-title">
                  <span>🏪</span> Shop Info
                </div>
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
                  <span className="sd-badge" style={{ backgroundColor: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Info Card */}
            <div className="sd-card">
              <div className="sd-card-heading">
                <div className="sd-card-title">
                  <span>👤</span> Owner Info
                </div>
                <span className="sd-role-badge">CLIENT</span>
              </div>

              <div className="sd-owner-photo-row">
                <div className="sd-owner-photo">
                  {owner?.name ? (
                    <span className="sd-owner-initials">
                      {owner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  ) : (
                    <span>👤</span>
                  )}
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

          {/* Operational Status */}
          <div className="sd-status-card">
            <div className="sd-status-left">
              <div className="sd-status-icon">📍</div>
              <div>
                <p className="sd-status-label">Operational Status</p>
                <p className="sd-status-desc">Manage the shop's visibility and accessibility in the platform.</p>
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
                {isToggling && <span className="sd-toggling-text">Updating...</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="sd-stats-grid">
            {[
              { label: "TOTAL PRODUCTS", value: stats.totalProducts, icon: '📦' },
              { label: "CATEGORIES", value: stats.categoriesCount, icon: '📂' },
              { label: "TRANSACTIONS", value: stats.transactionsCount, icon: '🔄' },
            ].map((stat, i) => (
              <div key={i} className="sd-stat-card">
                <div className="sd-stat-icon" style={{ 
                  backgroundColor: i === 0 ? 'rgba(255,107,0,0.1)' : 
                                  i === 1 ? 'rgba(33,150,243,0.1)' : 
                                  'rgba(76,175,80,0.1)' 
                }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="sd-stat-label">{stat.label}</p>
                  <p className="sd-stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="sd-bottom-actions">
            <button className="sd-btn-download" onClick={() => alert('Download report feature coming soon!')}>
              📥 Download Report
            </button>
            <button 
              className="sd-btn-delete"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this shop? This action cannot be undone!')) {
                  alert('Delete shop feature coming soon!');
                }
              }}
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;