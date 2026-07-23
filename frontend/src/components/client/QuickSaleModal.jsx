import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import stockService from '../../services/stockService';
import '../../styles/manage-stock-modal.css';

const QuickSaleModal = ({ onClose, onUpdated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.getAll({ limit: 1000 });
        const data = res?.data?.data || res?.data || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedProduct
    ? products.find(p => (p.product_id || p.id) === selectedProduct)
    : null;

  const currentStock = selected ? (selected.current_quantity ?? selected.quantity ?? 0) : 0;
  const parsed = parseInt(quantity, 10);
  const amount = isNaN(parsed) || parsed < 0 ? 0 : parsed;
  const canSubmit = selectedProduct && amount > 0 && amount <= currentStock && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await stockService.recordSale({
        product_id: selectedProduct,
        quantity: amount,
        note: note.trim() || undefined,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record sale');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="msm-overlay" onClick={onClose}>
      <div className="msm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="msm-header">
          <div>
            <div className="msm-eyebrow">QUICK LOG SALE</div>
            <h3 className="msm-title">Record a Sale</h3>
          </div>
          <button className="msm-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form className="msm-form" onSubmit={handleSubmit}>
          <label className="msm-label">Product</label>
          {loading ? (
            <div className="msm-loading" style={{ padding: '12px 0' }}>Loading products...</div>
          ) : (
            <>
              <input
                className="msm-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedProduct(null); }}
                style={{ marginBottom: 8 }}
              />
              <div style={{
                maxHeight: 180, overflowY: 'auto', border: '1px solid #e2bfb0',
                borderRadius: 8, marginBottom: 16, background: '#fff'
              }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 16, color: '#888', fontSize: 13, textAlign: 'center' }}>
                    No products found
                  </div>
                ) : filtered.map((p) => {
                  const id = p.product_id || p.id;
                  const qty = p.current_quantity ?? p.quantity ?? 0;
                  const isSelected = selectedProduct === id;
                  return (
                    <div
                      key={id}
                      onClick={() => { setSelectedProduct(id); setSearch(p.name); }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', fontSize: 14,
                        background: isSelected ? '#fff3e6' : 'transparent',
                        borderBottom: '1px solid #f0eeed',
                        display: 'flex', justifyContent: 'space-between',
                        fontWeight: isSelected ? 600 : 400,
                        color: qty <= 0 ? '#b91c1c' : '#1A1A1A',
                      }}
                    >
                      <span>{p.name}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>Stock: {qty}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {selected && (
            <div className="msm-stock-info" style={{ marginBottom: 16 }}>
              <span className="msm-stock-label">Current Stock</span>
              <span className="msm-stock-value">{currentStock}</span>
              <span className="msm-stock-min">Min: {selected.min_quantity ?? 0}</span>
            </div>
          )}

          <label className="msm-label" htmlFor="qs-qty">Quantity to Sell</label>
          <input
            id="qs-qty"
            className="msm-input"
            type="number"
            min="1"
            max={currentStock || 1}
            placeholder="Enter amount..."
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={!selectedProduct}
          />

          {selectedProduct && amount > 0 && (
            <div className="msm-readout">
              <span className="msm-readout-label">New Total After Sale:</span>
              <span className="msm-readout-value">{currentStock - amount} {selected?.unit || 'pcs'}</span>
            </div>
          )}

          {amount > currentStock && (
            <div className="msm-warning">Cannot sell more than current stock ({currentStock})</div>
          )}

          <label className="msm-label" htmlFor="qs-notes">Notes (Optional)</label>
          <textarea
            id="qs-notes"
            className="msm-textarea"
            placeholder="Sale details, customer info..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="msm-actions">
            <button
              className="msm-btn msm-btn-danger"
              type="submit"
              disabled={!canSubmit}
            >
              {submitting ? 'Recording...' : 'Confirm Sale'}
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

export default QuickSaleModal;
