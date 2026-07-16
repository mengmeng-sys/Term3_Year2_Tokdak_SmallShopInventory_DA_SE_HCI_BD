import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import dashboardService from '../../services/dashboardService';
import '../../styles/adminDashboard.css';
import '../../styles/Product.css';

const Icon = {
  ChevronDown: () => (
    <svg width="12" height="7.4" fill="none" viewBox="0 0 12 7.4">
      <path d="M1 1l5 5 5-5" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path d="M16.5 16.5l-3.675-3.675M14.25 8.25A6 6 0 118.25 2.25a6 6 0 016 6z" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path d="M13.5 2.25l2.25 2.25-9 9H4.5v-2.25l9-9zM11.25 4.5l2.25 2.25" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="18" fill="none" viewBox="0 0 16 18">
      <path d="M1 4h14M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="7.4" height="12" fill="none" viewBox="0 0 7.4 12">
      <path d="M6.4 1L1.4 6l5 5" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="7.4" height="12" fill="none" viewBox="0 0 7.4 12">
      <path d="M1 1l5 5-5 5" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  StockGreen: () => (
    <svg width="20" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#15803D" strokeWidth="1.5"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="#15803D" strokeWidth="1.5"/>
    </svg>
  ),
  WarningOrange: () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
      <path d="M8.46 1.53a2 2 0 013.08 0l7.38 8.94A2 2 0 0119.18 13H2.82a2 2 0 01-1.27-2.53L8.46 1.53z" stroke="#C2410C" strokeWidth="1.5"/>
      <path d="M11 7v3M11 13v.5" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  AlertRed: () => (
    <svg width="20" height="22" fill="none" viewBox="0 0 20 22">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke="#B91C1C" strokeWidth="1.5"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#B91C1C" strokeWidth="1.5"/>
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path d="M1 1l12 12M13 1L1 13" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

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
    <span className="prd-status-badge" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
      <span className="prd-status-dot" style={{ backgroundColor: c.dot }} />
      <span style={{ color: c.text }}>{status}</span>
    </span>
  );
}

function CategoryBadge({ label }) {
  return <span className="prd-category-badge">{label}</span>;
}

/* ── Edit Modal ──────────────────────────────────────────────────────────── */
function EditModal({ open, onClose, product, categories, onSave, submitting }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', unit: 'pcs',
    current_quantity: 0, min_quantity: 10,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        category_id: product.category_id || '',
        unit: product.unit || 'pcs',
        current_quantity: product.current_quantity ?? 0,
        min_quantity: product.min_quantity ?? 10,
      });
      setErrors({});
    }
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !product) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.category_id) errs.category_id = 'Required';
    if (form.price === '' || form.price === null) errs.price = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      category_id: Number(form.category_id),
      unit: form.unit || 'pcs',
      current_quantity: Number(form.current_quantity) || 0,
      min_quantity: Number(form.min_quantity) || 0,
    });
  };

  return (
    <div className="prd-modal-overlay" onClick={onClose}>
      <div className="prd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prd-modal-header">
          <h2 className="prd-modal-title">Edit Product</h2>
          <button className="prd-modal-close" onClick={onClose} aria-label="Close"><Icon.Close /></button>
        </div>
        <div className="prd-modal-body">
          <div className="prd-modal-grid">
            <div className="prd-modal-field">
              <label className="prd-modal-label">Product Name <span className="prd-modal-required">*</span></label>
              <input
                className={`prd-modal-input${errors.name ? ' prd-modal-input--error' : ''}`}
                type="text" value={form.name} onChange={handleChange('name')}
              />
              {errors.name && <span className="prd-modal-error">{errors.name}</span>}
            </div>
            <div className="prd-modal-field">
              <label className="prd-modal-label">Category <span className="prd-modal-required">*</span></label>
              <select
                className={`prd-modal-input prd-modal-select${errors.category_id ? ' prd-modal-input--error' : ''}`}
                value={form.category_id} onChange={handleChange('category_id')}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <span className="prd-modal-error">{errors.category_id}</span>}
            </div>
            <div className="prd-modal-field">
              <label className="prd-modal-label">Price ($) <span className="prd-modal-required">*</span></label>
              <input
                className={`prd-modal-input${errors.price ? ' prd-modal-input--error' : ''}`}
                type="number" min={0} step="0.01" value={form.price} onChange={handleChange('price')}
              />
              {errors.price && <span className="prd-modal-error">{errors.price}</span>}
            </div>
            <div className="prd-modal-field">
              <label className="prd-modal-label">Unit</label>
              <select className="prd-modal-input prd-modal-select" value={form.unit} onChange={handleChange('unit')}>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="mL">mL</option>
                <option value="box">box</option>
                <option value="pack">pack</option>
              </select>
            </div>
            <div className="prd-modal-field">
              <label className="prd-modal-label">Current Quantity</label>
              <input
                className="prd-modal-input"
                type="number" min={0} value={form.current_quantity} onChange={handleChange('current_quantity')}
              />
            </div>
            <div className="prd-modal-field">
              <label className="prd-modal-label">Min Quantity</label>
              <input
                className="prd-modal-input"
                type="number" min={0} value={form.min_quantity} onChange={handleChange('min_quantity')}
              />
            </div>
          </div>
          <div className="prd-modal-field prd-modal-field--full">
            <label className="prd-modal-label">Description</label>
            <textarea
              className="prd-modal-input prd-modal-textarea"
              rows={3} value={form.description} onChange={handleChange('description')}
              placeholder="Optional product description..."
            />
          </div>
        </div>
        <div className="prd-modal-footer">
          <button className="prd-modal-btn prd-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="prd-modal-btn prd-modal-btn--confirm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Modal ────────────────────────────────────────────────────────── */
function DeleteModal({ open, onClose, product, onConfirm, submitting }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div className="prd-modal-overlay" onClick={onClose}>
      <div className="prd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prd-modal-header">
          <h2 className="prd-modal-title">Delete Product</h2>
          <button className="prd-modal-close" onClick={onClose} aria-label="Close"><Icon.Close /></button>
        </div>
        <div className="prd-modal-body">
          <p className="prd-delete-msg">
            Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="prd-modal-footer">
          <button className="prd-modal-btn prd-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="prd-modal-btn prd-modal-btn--delete" onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Controls Row ────────────────────────────────────────────────────────── */
function ControlsRow({ search, setSearch, categories, selectedCategory, setSelectedCategory, sort, setSort }) {
  const navigate = useNavigate();
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const catDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    if (!catDropdownOpen && !sortDropdownOpen) return;
    const handleClick = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setCatDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [catDropdownOpen, sortDropdownOpen]);

  const selectedCatLabel = selectedCategory === null
    ? 'All Categories'
    : categories.find((c) => c.category_id === selectedCategory)?.name || 'All Categories';

  const sortLabel = sort === 'oldest' ? 'Oldest First' : 'Newest First';

  return (
    <div className="prd-controls-row">
      <div className="prd-search-wrap">
        <div className="prd-search-icon"><Icon.Search /></div>
        <input
          className="prd-search-input"
          placeholder="Search product name, SKU or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="prd-filters">
        <div className="prd-filter-dropdown" ref={catDropdownRef}>
          <button
            className="prd-filter-select"
            onClick={() => { setCatDropdownOpen(!catDropdownOpen); setSortDropdownOpen(false); }}
          >
            <span>{selectedCatLabel}</span>
            <Icon.ChevronDown />
          </button>
          {catDropdownOpen && (
            <div className="prd-filter-menu">
              <button
                className={`prd-filter-option${selectedCategory === null ? ' prd-filter-option--active' : ''}`}
                onClick={() => { setSelectedCategory(null); setCatDropdownOpen(false); }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  className={`prd-filter-option${selectedCategory === cat.category_id ? ' prd-filter-option--active' : ''}`}
                  onClick={() => { setSelectedCategory(cat.category_id); setCatDropdownOpen(false); }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="prd-filter-dropdown" ref={sortDropdownRef}>
          <button
            className="prd-filter-select"
            onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setCatDropdownOpen(false); }}
          >
            <span>Sort: {sortLabel}</span>
            <Icon.ChevronDown />
          </button>
          {sortDropdownOpen && (
            <div className="prd-filter-menu">
              <button
                className={`prd-filter-option${sort === 'newest' || sort === '' ? ' prd-filter-option--active' : ''}`}
                onClick={() => { setSort('newest'); setSortDropdownOpen(false); }}
              >
                Newest First
              </button>
              <button
                className={`prd-filter-option${sort === 'oldest' ? ' prd-filter-option--active' : ''}`}
                onClick={() => { setSort('oldest'); setSortDropdownOpen(false); }}
              >
                Oldest First
              </button>
            </div>
          )}
        </div>
      </div>
      <button className="prd-add-btn" onClick={() => navigate('/client/products/add')}>
        <Icon.Plus />
        <span>Add Product</span>
      </button>
    </div>
  );
}

/* ── Product Table ───────────────────────────────────────────────────────── */
function ProductTable({ products, loading, page, setPage, totalPages, totalProducts, onEdit, onDelete }) {
  return (
    <div className="prd-table-container">
      <div className="prd-table-scroll">
        <div className="prd-table-header">
          <div className="prd-th prd-th--name">PRODUCT NAME</div>
          <div className="prd-th prd-th--cat">CATEGORY</div>
          <div className="prd-th prd-th--price">PRICE</div>
          <div className="prd-th prd-th--qty">CURRENT<br />QTY</div>
          <div className="prd-th prd-th--min">MIN<br />QTY</div>
          <div className="prd-th prd-th--status">STATUS</div>
          <div className="prd-th prd-th--actions">ACTIONS</div>
        </div>
        {loading ? (
          <div className="dash-empty-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="dash-empty-state">No products found</div>
        ) : (
          products.map((p, i) => {
            const qty = p.current_quantity ?? p.quantity ?? 0;
            const minQty = p.min_quantity ?? p.min_quantity_alert ?? 0;
            const status = getStatus(qty, minQty);
            return (
              <div key={p.product_id || p.id || i} className={`prd-table-row${i > 0 ? ' prd-table-row--bordered' : ''}`}>
                <div className="prd-td prd-td--name">
                  <div className="prd-product-thumb">
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#e4e2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#5f5e5e' }}>
                      {(p.name || '?').charAt(0)}
                    </div>
                  </div>
                  <div className="prd-product-info">
                    <Link to={`/client/products/${p.product_id || p.id}`} className="prd-product-name">{p.name}</Link>
                    <span className="prd-product-sku">{p.sku || `SKU-${p.product_id || p.id}`}</span>
                  </div>
                </div>
                <div className="prd-td prd-td--cat">
                  <CategoryBadge label={p.category_name || p.category || '—'} />
                </div>
                <div className="prd-td prd-td--price">
                  <span className="prd-price">{p.price != null ? `$${Number(p.price).toFixed(2)}` : '—'}</span>
                </div>
                <div className="prd-td prd-td--qty">
                  <span className={`prd-qty${status !== 'Healthy' ? ' prd-qty--warn' : ''}`}>{qty}</span>
                </div>
                <div className="prd-td prd-td--min">
                  <span className="prd-min-qty">{minQty}</span>
                </div>
                <div className="prd-td prd-td--status">
                  <StatusBadge status={status} />
                </div>
                <div className="prd-td prd-td--actions">
                  <button className="prd-action-btn" title="Edit" onClick={() => onEdit(p)}><Icon.Edit /></button>
                  <button className="prd-action-btn" title="Delete" onClick={() => onDelete(p)}><Icon.Trash /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="prd-pagination">
        <span className="prd-pagination-info">
          Showing {products.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, totalProducts)} of {totalProducts} products
        </span>
        <div className="prd-pagination-btns">
          <button className={`prd-page-btn${page <= 1 ? ' prd-page-btn--disabled' : ''}`} onClick={() => page > 1 && setPage(page - 1)}>
            <Icon.ChevronLeft />
          </button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((n) => (
            <button key={n} className={`prd-page-btn${page === n ? ' prd-page-btn--active' : ''}`} onClick={() => setPage(n)}>
              {n}
            </button>
          ))}
          <button className={`prd-page-btn${page >= totalPages ? ' prd-page-btn--disabled' : ''}`} onClick={() => page < totalPages && setPage(page + 1)}>
            <Icon.ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Summary Cards ───────────────────────────────────────────────────────── */
function SummaryCards({ totalProducts, lowStock, outOfStock }) {
  return (
    <div className="prd-summary-row">
      <div className="prd-summary-card">
        <div className="prd-summary-icon prd-summary-icon--green">
          <Icon.StockGreen />
        </div>
        <div className="prd-summary-text">
          <span className="prd-summary-label">TOTAL ITEMS</span>
          <span className="prd-summary-value prd-summary-value--dark">{totalProducts}</span>
        </div>
      </div>
      <div className="prd-summary-card">
        <div className="prd-summary-icon prd-summary-icon--orange">
          <Icon.WarningOrange />
        </div>
        <div className="prd-summary-text">
          <span className="prd-summary-label">LOW STOCK ALERTS</span>
          <span className="prd-summary-value prd-summary-value--orange">{lowStock}</span>
        </div>
      </div>
      <div className="prd-summary-card">
        <div className="prd-summary-icon prd-summary-icon--red">
          <Icon.AlertRed />
        </div>
        <div className="prd-summary-text">
          <span className="prd-summary-label">OUT OF STOCK</span>
          <span className="prd-summary-value prd-summary-value--red">{outOfStock}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
const ProductManagement = () => {
  const mountedRef = useRef(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [summary, setSummary] = useState({ total_products: 0, low_stock: 0, out_of_stock: 0 });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sort, setSort] = useState('newest');

  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== null) params.category_id = selectedCategory;
      if (sort === 'oldest') params.sort = 'oldest';
      const res = await productService.getAll(params);
      if (!mountedRef.current) return;
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : data.products || data.data || [];
      setProducts(list);
      setTotalProducts(data.total || list.length || 0);
      setTotalPages(data.totalPages || Math.ceil((data.total || list.length) / 10) || 1);
    } catch {
      if (!mountedRef.current) return;
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [page, search, selectedCategory, sort]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (!mountedRef.current) return;
        const data = res.data?.data || res.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await dashboardService.getClientDashboard();
        if (!mountedRef.current) return;
        const data = res.data?.data || res.data || {};
        setSummary({
          total_products: data.total_products || 0,
          low_stock: data.low_stock || 0,
          out_of_stock: data.out_of_stock || 0,
        });
      } catch { /* ignore */ }
    };
    fetchSummary();
  }, []);

  const handleEdit = async (data) => {
    if (!editProduct) return;
    setEditSubmitting(true);
    try {
      await productService.update(editProduct.product_id || editProduct.id, data);
      setEditOpen(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleteSubmitting(true);
    try {
      await productService.remove(deleteProduct.product_id || deleteProduct.id);
      setDeleteOpen(false);
      setDeleteProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Products" />
        <div className="dash-content">
          <ControlsRow
            search={search}
            setSearch={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sort={sort}
            setSort={setSort}
          />
          <ProductTable
            products={products}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            onEdit={(p) => { setEditProduct(p); setEditOpen(true); }}
            onDelete={(p) => { setDeleteProduct(p); setDeleteOpen(true); }}
          />
          <SummaryCards
            totalProducts={summary.total_products}
            lowStock={summary.low_stock}
            outOfStock={summary.out_of_stock}
          />
        </div>
      </div>

      <EditModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditProduct(null); }}
        product={editProduct}
        categories={categories}
        onSave={handleEdit}
        submitting={editSubmitting}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteProduct(null); }}
        product={deleteProduct}
        onConfirm={handleDelete}
        submitting={deleteSubmitting}
      />
    </div>
  );
};

export default ProductManagement;
