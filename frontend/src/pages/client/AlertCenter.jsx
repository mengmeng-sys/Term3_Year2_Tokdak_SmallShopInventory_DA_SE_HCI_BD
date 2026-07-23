import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import ManageStockModal from '../../components/common/ManageStockModal';
import alertService from '../../services/alertService';
import stockService from '../../services/stockService';
import '../../styles/adminDashboard.css';
import '../../styles/alert-center.css';

const AlertCenter = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [resolveProductId, setResolveProductId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [alertsRes, lowStockRes] = await Promise.all([
        alertService.getAll(),
        stockService.getLowStock(),
      ]);

      const alerts = alertsRes?.data?.data || alertsRes?.data || [];
      const lowStockProducts = lowStockRes?.data?.data || lowStockRes?.data || [];

      const alertMap = new Map();
      for (const a of Array.isArray(alerts) ? alerts : []) {
        alertMap.set(a.product_id, a);
      }

      const merged = [];

      for (const p of Array.isArray(lowStockProducts) ? lowStockProducts : []) {
        const existing = alertMap.get(p.product_id);
        merged.push({
          product_id: p.product_id,
          product_name: p.name,
          current_quantity: p.current_quantity,
          min_quantity: p.min_quantity,
          alert_type: p.current_quantity === 0 ? 'out_of_stock' : 'low_stock',
          alert_id: existing?.alert_id || null,
        });
        alertMap.delete(p.product_id);
      }

      for (const a of alertMap.values()) {
        merged.push({
          product_id: a.product_id,
          product_name: a.product_name,
          current_quantity: a.current_quantity,
          min_quantity: a.min_quantity,
          alert_type: a.type,
          alert_id: a.alert_id,
        });
      }

      setItems(merged);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = items.filter((a) => {
    if (filter === 'all') return true;
    return a.alert_type === filter;
  });

  const outOfStockCount = items.filter((a) => a.alert_type === 'out_of_stock').length;
  const lowStockCount = items.filter((a) => a.alert_type === 'low_stock').length;

  const handleResolve = (e, productId) => {
    e.stopPropagation();
    setResolveProductId(productId);
  };

  const handleResolved = () => {
    setResolveProductId(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <Topbar title="Alert Center" />
          <div className="dash-content">
            <div className="dash-loading">
              <div className="dash-spinner"></div>
              <p>Loading alerts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Alert Center" />
        <div className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Alert Center</h1>
              <p className="dash-page-subtitle">Items that need your attention.</p>
            </div>
          </div>

          <div className="alert-summary-row">
            <div className="alert-summary-card" style={{ borderLeftColor: '#ef4444' }}>
              <p className="alert-summary-label">OUT OF STOCK</p>
              <span className="alert-summary-value" style={{ color: '#ef4444' }}>{outOfStockCount}</span>
            </div>
            <div className="alert-summary-card" style={{ borderLeftColor: '#f59e0b' }}>
              <p className="alert-summary-label">LOW STOCK</p>
              <span className="alert-summary-value" style={{ color: '#f59e0b' }}>{lowStockCount}</span>
            </div>
            <div className="alert-summary-card" style={{ borderLeftColor: '#ff6b00' }}>
              <p className="alert-summary-label">TOTAL ALERTS</p>
              <span className="alert-summary-value" style={{ color: '#ff6b00' }}>{items.length}</span>
            </div>
          </div>

          <div className="alert-filters">
            {[
              { key: 'all', label: `All (${items.length})` },
              { key: 'out_of_stock', label: `Out of Stock (${outOfStockCount})` },
              { key: 'low_stock', label: `Low Stock (${lowStockCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`alert-filter-btn ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="alert-table-card">
              <div className="alert-table-head">
                <div className="alert-th">PRODUCT</div>
                <div className="alert-th">STATUS</div>
                <div className="alert-th">STOCK</div>
                <div className="alert-th">MIN</div>
                <div className="alert-th">ACTION</div>
              </div>
              {filtered.map((item, i) => (
                <div
                  key={item.product_id}
                  className={`alert-table-row ${i % 2 === 1 ? 'alt' : ''}`}
                  onClick={() => navigate(`/client/stock/restock/${item.product_id}`)}
                >
                  <div className="alert-cell alert-cell--product">
                    <div className="alert-thumb">
                      {item.product_name ? item.product_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="alert-product-name">{item.product_name}</span>
                  </div>
                  <div className="alert-cell">
                    <span className={`alert-type-badge ${item.alert_type === 'out_of_stock' ? 'out-of-stock' : 'low-stock'}`}>
                      {item.alert_type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                  <div className="alert-cell">
                    <div className="alert-stock-info">
                      <span className={`alert-stock-current ${item.current_quantity === 0 ? 'critical' : 'low'}`}>
                        {item.current_quantity}
                      </span>
                    </div>
                  </div>
                  <div className="alert-cell">
                    <span className="alert-stock-min">{item.min_quantity}</span>
                  </div>
                  <div className="alert-cell">
                    <button
                      className="alert-btn-restock"
                      onClick={(e) => handleResolve(e, item.product_id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert-empty">
              <div className="alert-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3 className="alert-empty-title">No alerts</h3>
              <p className="alert-empty-text">All products are well-stocked.</p>
            </div>
          )}
        </div>
      </div>

      {resolveProductId && (
        <ManageStockModal
          productId={resolveProductId}
          onClose={() => setResolveProductId(null)}
          onUpdated={handleResolved}
        />
      )}
    </div>
  );
};

export default AlertCenter;
