import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import productService from '../../services/productService';
import stockService from '../../services/stockService';
import { formatDateTime } from '../../utils/formatDate';
import '../../styles/adminDashboard.css';
import '../../styles/ProductDetails.css';

function getStatus(currentQty, minQty) {
  const current = parseInt(String(currentQty).replace(/,/g, ''), 10);
  const min = parseInt(String(minQty).replace(/,/g, ''), 10);
  if (current <= 0) return 'Critical';
  if (current < min) return 'Low';
  return 'Healthy';
}

const stockStatusConfig = {
  Healthy:  { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e', text: '#15803d' },
  Low:      { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316', text: '#c2410c' },
  Critical: { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444', text: '#b91c1c' },
};

function StatusBadge({ status }) {
  const c = stockStatusConfig[status];
  return (
    <span className="pdet-status-badge" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
      <span className="pdet-status-dot" style={{ backgroundColor: c.dot }} />
      <span style={{ color: c.text }}>{status}</span>
    </span>
  );
}

function TypeBadge({ type }) {
  const config = {
    restock:    { bg: '#dcfce7', text: '#15803d', label: 'Restock' },
    sale:       { bg: '#fef3c7', text: '#b45309', label: 'Sale' },
    adjustment: { bg: '#e0e7ff', text: '#4338ca', label: 'Adjustment' },
  };
  const c = config[type] || { bg: '#f5f3f3', text: '#5f5e5e', label: type };
  return (
    <span className="pdet-type-badge" style={{ backgroundColor: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(id);
        const data = res.data?.data || res.data || {};
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await stockService.getProductHistory(id);
        const data = res.data?.data || res.data || [];
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        setTransactions([]);
      } finally {
        setTxLoading(false);
      }
    };

    fetchProduct();
    fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <Topbar title="Product Details" />
          <div className="dash-content">
            <div className="pdet-loading">Loading product details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <Topbar title="Product Details" />
          <div className="dash-content">
            <div className="pdet-error">
              <p>{error || 'Product not found'}</p>
              <button className="pdet-back-btn" onClick={() => navigate('/client/products')}>
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const qty = product.current_quantity ?? product.quantity ?? 0;
  const minQty = product.min_quantity ?? 0;
  const status = getStatus(qty, minQty);

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Product Details" />
        <div className="dash-content">
          <div className="pdet-nav-row">
            <button className="pdet-back-btn" onClick={() => navigate('/client/products')}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Products
            </button>
          </div>

          <div className="pdet-breadcrumb">
            <span className="pdet-breadcrumb-link">Products</span>
            <span className="pdet-breadcrumb-sep">/</span>
            <span className="pdet-breadcrumb-current">{product.name}</span>
          </div>

          <div className="pdet-info-card">
            <div className="pdet-info-header">
              <div className="pdet-info-avatar">
                {(product.name || '?').charAt(0)}
              </div>
              <div className="pdet-info-title-group">
                <h1 className="pdet-info-name">{product.name}</h1>
                <span className="pdet-info-sku">{product.sku || `SKU-${product.product_id || product.id}`}</span>
              </div>
              <StatusBadge status={status} />
            </div>
            <div className="pdet-info-grid">
              <div className="pdet-info-item">
                <span className="pdet-info-label">Price</span>
                <span className="pdet-info-value">${Number(product.price || 0).toFixed(2)}</span>
              </div>
              <div className="pdet-info-item">
                <span className="pdet-info-label">Category</span>
                <span className="pdet-info-value">{product.category_name || product.category || '—'}</span>
              </div>
              <div className="pdet-info-item">
                <span className="pdet-info-label">Current Quantity</span>
                <span className="pdet-info-value">{qty} {product.unit || 'pcs'}</span>
              </div>
              <div className="pdet-info-item">
                <span className="pdet-info-label">Min Quantity</span>
                <span className="pdet-info-value">{minQty} {product.unit || 'pcs'}</span>
              </div>
              <div className="pdet-info-item">
                <span className="pdet-info-label">Unit</span>
                <span className="pdet-info-value">{product.unit || 'pcs'}</span>
              </div>
              <div className="pdet-info-item">
                <span className="pdet-info-label">Created</span>
                <span className="pdet-info-value">{formatDateTime(product.created_at)}</span>
              </div>
            </div>
            {product.description && (
              <div className="pdet-description">
                <span className="pdet-info-label">Description</span>
                <p className="pdet-description-text">{product.description}</p>
              </div>
            )}
          </div>

          <div className="pdet-tx-section">
            <h2 className="pdet-tx-title">Transaction History</h2>
            <div className="pdet-tx-table-wrap">
              <div className="pdet-tx-header-row">
                <div className="pdet-tx-th">TYPE</div>
                <div className="pdet-tx-th">QUANTITY CHANGED</div>
                <div className="pdet-tx-th">BEFORE</div>
                <div className="pdet-tx-th">AFTER</div>
                <div className="pdet-tx-th">NOTE</div>
                <div className="pdet-tx-th pdet-tx-th--right">DATE</div>
              </div>
              {txLoading ? (
                <div className="pdet-tx-empty">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="pdet-tx-empty">No transaction history found for this product.</div>
              ) : (
                transactions.map((tx, i) => (
                  <div key={tx.transaction_id || i} className={`pdet-tx-row${i > 0 ? ' pdet-tx-row--bordered' : ''}`}>
                    <div className="pdet-tx-td">
                      <TypeBadge type={tx.type} />
                    </div>
                    <div className="pdet-tx-td">
                      <span className="pdet-tx-qty">{tx.quantity_changed > 0 ? '+' : ''}{tx.quantity_changed}</span>
                    </div>
                    <div className="pdet-tx-td">
                      <span className="pdet-tx-before">{tx.quantity_before}</span>
                    </div>
                    <div className="pdet-tx-td">
                      <span className="pdet-tx-after">{tx.quantity_after}</span>
                    </div>
                    <div className="pdet-tx-td">
                      <span className="pdet-tx-note">{tx.note || '—'}</span>
                    </div>
                    <div className="pdet-tx-td pdet-tx-td--right">
                      <span className="pdet-tx-date">{formatDateTime(tx.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
