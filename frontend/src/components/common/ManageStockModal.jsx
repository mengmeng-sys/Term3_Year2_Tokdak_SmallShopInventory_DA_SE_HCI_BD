import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import stockService from '../../services/stockService';
import '../../styles/manage-stock-modal.css';

const ManageStockModal = ({ productId, onClose, onUpdated }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(productId);
        const data = res.data?.data || res.data || {};
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const currentStock = product ? (product.current_quantity ?? product.quantity ?? 0) : 0;
  const minQty = product?.min_quantity ?? 0;
  const parsed = parseInt(quantity, 10);
  const amount = isNaN(parsed) || parsed < 0 ? 0 : parsed;

  const newTotal = mode === 'add' ? currentStock + amount : currentStock - amount;
  const canSubmit = amount > 0 && !submitting && (mode === 'subtract' ? amount <= currentStock : true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (mode === 'add') {
        await stockService.restock({
          product_id: productId,
          quantity: amount,
          note: note.trim() || undefined,
        });
      } else {
        await stockService.recordSale({
          product_id: productId,
          quantity: amount,
          note: note.trim() || undefined,
        });
      }
      onUpdated?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="msm-overlay" onClick={onClose}>
        <div className="msm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="msm-loading">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="msm-overlay" onClick={onClose}>
        <div className="msm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="msm-error">{error || 'Product not found'}</div>
          <button className="msm-btn msm-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="msm-overlay" onClick={onClose}>
      <div className="msm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="msm-header">
          <div>
            <div className="msm-eyebrow">MANAGE STOCK</div>
            <h3 className="msm-title">{product.name}</h3>
          </div>
          <button className="msm-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="msm-stock-info">
          <span className="msm-stock-label">Current Stock</span>
          <span className="msm-stock-value">{currentStock}</span>
          <span className="msm-stock-min">Min: {minQty}</span>
        </div>

        <div className="msm-tabs">
          <button
            className={`msm-tab${mode === 'add' ? ' active' : ''}`}
            onClick={() => { setMode('add'); setQuantity(''); setNote(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
            Add Stock
          </button>
          <button
            className={`msm-tab${mode === 'subtract' ? ' active' : ''}`}
            onClick={() => { setMode('subtract'); setQuantity(''); setNote(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
            </svg>
            Subtract Stock
          </button>
        </div>

        <form className="msm-form" onSubmit={handleSubmit}>
          <label className="msm-label" htmlFor="msm-qty">
            {mode === 'add' ? 'Quantity to Add' : 'Quantity to Subtract'}
          </label>
          <input
            id="msm-qty"
            className="msm-input"
            type="number"
            min="1"
            max={mode === 'subtract' ? currentStock : undefined}
            placeholder={mode === 'add' ? 'Enter amount to add...' : 'Enter amount to subtract...'}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {mode === 'subtract' && amount > currentStock && (
            <div className="msm-warning">Cannot subtract more than current stock ({currentStock})</div>
          )}

          <div className={`msm-readout${newTotal < 0 ? ' msm-readout--error' : ''}`}>
            <span className="msm-readout-label">New Total After {mode === 'add' ? 'Restock' : 'Sale'}:</span>
            <span className="msm-readout-value">{newTotal} {product.unit || 'pcs'}</span>
          </div>

          <label className="msm-label" htmlFor="msm-notes">
            Notes (Optional)
          </label>
          <textarea
            id="msm-notes"
            className="msm-textarea"
            placeholder={mode === 'add' ? 'Supplier details, restock reason...' : 'Sale details, customer info...'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="msm-actions">
            <button
              className={`msm-btn ${mode === 'add' ? 'msm-btn-primary' : 'msm-btn-danger'}`}
              type="submit"
              disabled={!canSubmit}
            >
              {submitting
                ? (mode === 'add' ? 'Adding...' : 'Subtracting...')
                : (mode === 'add' ? 'Confirm Add Stock' : 'Confirm Subtract Stock')}
            </button>
            <button className="msm-btn msm-btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStockModal;
