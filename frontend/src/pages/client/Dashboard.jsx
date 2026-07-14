import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
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

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        setLoading(true);
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
        console.error('Error loading client dashboard:', err);
        setStats({ total_products: 0, low_stock: 0, out_of_stock: 0, total_categories: 0 });
        setRecentAlerts([]);
        setRecentTransactions([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();
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

        <div className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Shop Overview</h1>
              <p className="dash-page-subtitle">Real-time snapshot of your inventory.</p>
            </div>
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

          <div className="dash-table-section" style={{ marginBottom: 24 }}>
            <div className="dash-table-header">
              <h2 className="dash-table-title">Recent Alerts</h2>
              <button onClick={() => navigate('/client/alerts')} className="dash-table-viewall">
                View All
              </button>
            </div>
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
                    onClick={() => navigate(`/client/products/${alert.product_id}`)}
                  >
                    <div className="dash-cell bold">{alert.product_name}</div>
                    <div className="dash-cell">{alert.message}</div>
                    <div className="dash-cell">
                      <span className="dash-badge"
                        style={{
                          backgroundColor: alert.alert_type === 'out_of_stock' ? '#ffebee' : '#fff8e1',
                          color: alert.alert_type === 'out_of_stock' ? '#c62828' : '#f59e0b',
                        }}
                      >
                        {alert.alert_type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </div>
                    <div className="dash-cell">{formatDateTime(alert.created_at)}</div>
                  </div>
                ))
              ) : (
                <div className="dash-empty-state">No unresolved alerts</div>
              )}
            </div>
          </div>

          <div className="dash-table-section">
            <div className="dash-table-header">
              <h2 className="dash-table-title">Recent Transactions</h2>
              <button onClick={() => navigate('/client/restock-history')} className="dash-table-viewall">
                View All
              </button>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
