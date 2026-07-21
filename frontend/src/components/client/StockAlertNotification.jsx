import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const StockAlertNotification = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || visible) return;

    let cancelled = false;

    const fetchAlerts = async () => {
      try {
        const response = await productService.getAll({ limit: 1000 });
        if (cancelled) return;
        const products = response?.data?.data || response?.data || [];

        const outOfStock = products.filter(p => parseInt(p.current_quantity) === 0);
        const lowStock = products.filter(p => {
          const current = parseInt(p.current_quantity);
          const min = parseInt(p.min_quantity);
          return current > 0 && current < min;
        });

        const groups = [];
        if (outOfStock.length > 0) groups.push({ type: 'out_of_stock', label: 'Out of Stock', products: outOfStock.map(p => p.name) });
        if (lowStock.length > 0) groups.push({ type: 'low_stock', label: 'Low on Stock', products: lowStock.map(p => p.name) });

        if (groups.length > 0) {
          setVisible(groups);
        }
      } catch (err) {
        console.error('Failed to fetch stock alerts:', err);
      }
    };

    fetchAlerts();
    return () => { cancelled = true; };
  }, [dismissed, visible]);

  const dismissGroup = (type) => {
    setVisible(prev => {
      const next = prev.filter(g => g.type !== type);
      if (next.length === 0) setDismissed(true);
      return next.length > 0 ? next : null;
    });
  };

  const navigateToStock = (type) => {
    setVisible(prev => {
      const next = prev.filter(g => g.type !== type);
      if (next.length === 0) setDismissed(true);
      return next.length > 0 ? next : null;
    });
    navigate('/client/alerts');
  };

  if (!visible) return null;

  return (
    <div className="stock-alert-notifications">
      {visible.map((group) => (
        <div
          key={group.type}
          className={`stock-alert-toast ${group.type === 'out_of_stock' ? 'critical' : 'warning'}`}
          onClick={() => navigateToStock(group.type)}
        >
          <div className="stock-alert-icon">
            {group.type === 'out_of_stock' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
          </div>
          <div className="stock-alert-content">
            <span className="stock-alert-product">{group.label} ({group.products.length})</span>
            <span className="stock-alert-message">{group.products.join(', ')}</span>
          </div>
          <button className="stock-alert-close" onClick={(e) => { e.stopPropagation(); dismissGroup(group.type); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default StockAlertNotification;
