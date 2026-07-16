import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import productService from '../../services/productService';
import stockService from '../../services/stockService';
import '../../styles/adminDashboard.css';
import '../../styles/restock.css';

function getStatus(currentQty, minQty) {
  const current = parseInt(String(currentQty).replace(/,/g, ''), 10);
  const min = parseInt(String(minQty).replace(/,/g, ''), 10);
  if (current <= 0) return 'critical';
  if (current < min) return 'low';
  return 'healthy';
}

const RestockProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(id);
        const data = res.data?.data || res.data || {};
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const parsed = parseInt(quantity, 10);
  const addAmount = isNaN(parsed) || parsed < 0 ? 0 : parsed;
  const currentStock = product ? (product.current_quantity ?? product.quantity ?? 0) : 0;
  const newTotal = currentStock + addAmount;
  const status = product ? getStatus(currentStock, product.min_quantity ?? 0) : 'healthy';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addAmount) return;
    setSubmitting(true);
    try {
      await stockService.restock({
        product_id: product.product_id || product.id,
        quantity: addAmount,
        note: note.trim() || undefined,
      });
      navigate('/client/stock');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <Topbar title="Restock Product" />
          <div className="dash-content">
            <div className="r-loading">Loading product...</div>
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
          <Topbar title="Restock Product" />
          <div className="dash-content">
            <div className="r-error">
              <p>{error || 'Product not found'}</p>
              <button className="r-btn r-btn-primary" onClick={() => navigate('/client/stock')}>
                Back to Stock
              </button>
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
        <Topbar title="Restock Product" />

        <div className="dash-content">
          <div className="r-breadcrumb">
            <button className="r-breadcrumb-link" onClick={() => navigate('/client/stock')}>Stock</button>
            <span className="r-breadcrumb-sep">/</span>
            <span className="r-breadcrumb-current">Restock</span>
          </div>

          <div className="r-form-wrap">
            <p className="r-eyebrow">CURRENTLY EDITING</p>
            <h3 className="r-title">{product.name}</h3>

            <div className="r-cards">
              <div className="r-card r-card--critical">
                <div className="r-card-head">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>Current Stock</span>
                </div>
                <div className="r-card-value r-card-value--critical">{currentStock}</div>
                <span className={`r-badge r-badge--${status}`}>
                  {status === 'critical' ? 'CRITICAL' : status === 'low' ? 'LOW STOCK' : 'HEALTHY'}
                </span>
              </div>

              <div className="r-card">
                <div className="r-card-head">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1b1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <path d="M4 22V4" />
                  </svg>
                  <span>Min. Required</span>
                </div>
                <div className="r-card-value">{product.min_quantity ?? 0}</div>
                <div className="r-card-sub">Target Threshold</div>
              </div>
            </div>

            <form className="r-panel-card" onSubmit={handleSubmit}>
              <label className="r-label" htmlFor="r-qty">
                Quantity to Add
              </label>
              <input
                id="r-qty"
                className="r-input"
                type="number"
                min="0"
                placeholder="Enter amount..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <div className="r-readout">
                <span className="r-readout-label">New Total After Restock:</span>
                <span className="r-readout-value">{newTotal} {product.unit || 'pcs'}</span>
              </div>

              <label className="r-label" htmlFor="r-notes">
                Notes (Optional)
              </label>
              <textarea
                id="r-notes"
                className="r-textarea"
                placeholder="Add a reason for restock or supplier details..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="r-actions">
                <button className="r-btn r-btn-primary" type="submit" disabled={submitting || !addAmount}>
                  {submitting ? 'Restocking...' : 'Confirm Restock'}
                </button>
                <button className="r-btn r-btn-secondary" type="button" onClick={() => navigate('/client/stock')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockProduct;
