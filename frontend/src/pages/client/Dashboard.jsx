import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import StockAlertNotification from '../../components/client/StockAlertNotification';
import QuickSaleModal from '../../components/client/QuickSaleModal';
import dashboardService from '../../services/dashboardService';
import { formatDateTime } from '../../utils/formatDate';
import '../../styles/adminDashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_products: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_categories: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [collapsed, setCollapsed] = useState({ alerts: false, transactions: false });

  const refreshDashboard = async () => {
    try {
      const response = await dashboardService.getClientDashboard();
      if (!mountedRef.current) return;
      const data = response?.data?.data || response?.data || {};
      setStats({
        total_products: data.total_products || 0,
        low_stock: data.low_stock || 0,
        out_of_stock: data.out_of_stock || 0,
        total_categories: data.total_categories || 0,
      });
      setRecentAlerts(data.recent_alerts || []);
      setRecentTransactions(data.recent_transactions || []);
    } catch (err) {
      if (!mountedRef.current) return;
      setStats({ total_products: 0, low_stock: 0, out_of_stock: 0, total_categories: 0 });
      setRecentAlerts([]);
      setRecentTransactions([]);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    refreshDashboard().finally(() => {
      if (mountedRef.current) setLoading(false);
    });
    return () => { mountedRef.current = false; };
  }, []);

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
      <ClientSidebar />

      <div className="dash-main">
        <Topbar title="Dashboard Overview" />
        <StockAlertNotification />

        <div className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Shop Overview</h1>
              <p className="dash-page-subtitle">Real-time snapshot of your inventory.</p>
            </div>
            <button className="dash-btn-primary" onClick={() => setShowQuickSale(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Quick Log Sale
            </button>
          </div>

          <div className="dash-stats-grid">
            {[
              { label: 'TOTAL PRODUCTS', value: formatNumber(stats.total_products), accent: '#ff6b00' },
              { label: 'LOW STOCK', value: formatNumber(stats.low_stock), accent: '#f59e0b' },
              { label: 'OUT OF STOCK', value: formatNumber(stats.out_of_stock), accent: '#ef4444' },
              { label: 'CATEGORIES', value: formatNumber(stats.total_categories), accent: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="dash-stat-card" style={{ borderLeftColor: item.accent }}>
                <p className="dash-stat-label">{item.label}</p>
                <div className="dash-stat-value-wrap">
                  <span className="dash-stat-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-table-section dash-section--alerts" style={{ marginBottom: 24 }}>
            <div className="dash-table-header" onClick={() => setCollapsed(p => ({ ...p, alerts: !p.alerts }))} style={{ cursor: 'pointer' }}>
              <h2 className="dash-table-title">Stock Alerts</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={(e) => { e.stopPropagation(); navigate('/client/alerts'); }} className="dash-table-viewall">
                  View All
                </button>
                <span className={`dash-collapse-icon ${collapsed.alerts ? 'collapsed' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </div>
            </div>
            {!collapsed.alerts && (
              <div className="dash-table-container">
                <div className="dash-col-header-row" style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr' }}>
                  {['PRODUCT', 'ALERT', 'TYPE', 'DATE'].map(h => (
                    <div key={h} className="dash-col-header">{h}</div>
                  ))}
                </div>
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert, i) => (
                    <div key={alert.alert_id || i} className={`dash-row ${i % 2 === 1 ? 'alt' : ''}`}
                      style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr', cursor: 'pointer' }}
                      onClick={() => navigate(`/client/stock/restock/${alert.product_id}`)}
                    >
                      <div className="dash-cell bold">{alert.product_name}</div>
                      <div className="dash-cell">{alert.message}</div>
                      <div className="dash-cell">
                        <span className="dash-badge"
                          style={{
                              backgroundColor: alert.type === 'out_of_stock' ? '#ffebee' : '#fff8e1',
                              color: alert.type === 'out_of_stock' ? '#c62828' : '#f59e0b',
                            }}
                          >
                          {alert.type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </div>
                      <div className="dash-cell">{formatDateTime(alert.created_at)}</div>
                    </div>
                  ))
                ) : (
                  <div className="dash-empty-state">No unresolved alerts — everything is well-stocked!</div>
                )}
              </div>
            )}
          </div>

          <div className="dash-table-section">
            <div className="dash-table-header" onClick={() => setCollapsed(p => ({ ...p, transactions: !p.transactions }))} style={{ cursor: 'pointer' }}>
              <h2 className="dash-table-title">Recent Transactions</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={(e) => { e.stopPropagation(); navigate('/client/restock-history'); }} className="dash-table-viewall">
                  View All
                </button>
                <span className={`dash-collapse-icon ${collapsed.transactions ? 'collapsed' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </div>
            </div>
            {!collapsed.transactions && (
              <div className="dash-table-container">
                <div className="dash-col-header-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr' }}>
                  {['PRODUCT', 'TYPE', 'QTY', 'DATE'].map(h => (
                    <div key={h} className="dash-col-header">{h}</div>
                  ))}
                </div>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx, i) => (
                    <div key={tx.transaction_id || i} className={`dash-row ${i % 2 === 1 ? 'alt' : ''}`}
                      style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr' }}
                    >
                      <div className="dash-cell bold">{tx.product_name}</div>
                      <div className="dash-cell">
                        <span className="dash-badge"
                          style={{
                            backgroundColor: tx.type === 'purchase' ? '#e8f5e9' : '#e3f2fd',
                            color: tx.type === 'purchase' ? '#2e7d32' : '#1565c0',
                          }}
                        >
                          {tx.type === 'purchase' ? 'Restock' : 'Sale'}
                        </span>
                      </div>
                      <div className="dash-cell">{tx.quantity}</div>
                      <div className="dash-cell">{formatDateTime(tx.created_at)}</div>
                    </div>
                  ))
                ) : (
                  <div className="dash-empty-state">No recent transactions</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuickSale && (
        <QuickSaleModal
          onClose={() => setShowQuickSale(false)}
          onUpdated={refreshDashboard}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
