import { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import ManageStockModal from '../../components/common/ManageStockModal';
import productService from '../../services/productService';
import stockService from '../../services/stockService';
import '../../styles/adminDashboard.css';
import '../../styles/stock-overview.css';

/* ---------------- Icons ---------------- */
const Icon = {
  Search: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Cart: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  Edit: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  ),
  CritGauge: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3a9 9 0 1 0 8 5" /><path d="M12 7v5" /><path d="M12 16h.01" />
    </svg>
  ),
  Warn: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 2 20h20z" /><path d="M12 10v4" /><path d="M12 17h.01" />
    </svg>
  ),
  ChevL: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ChevR: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
}

function getStatus(currentQty, minQty) {
  const current = parseInt(String(currentQty).replace(/,/g, ''), 10);
  const min = parseInt(String(minQty).replace(/,/g, ''), 10);
  if (current <= 0) return 'critical';
  if (current < min) return 'low';
  return 'healthy';
}

function getStatusLabel(status) {
  if (status === 'critical') return 'CRITICAL';
  if (status === 'low') return 'LOW STOCK';
  return 'HEALTHY';
}

function getFillPercent(currentQty, minQty) {
  const current = parseInt(String(currentQty).replace(/,/g, ''), 10);
  const min = parseInt(String(minQty).replace(/,/g, ''), 10);
  if (current <= 0) return 2;
  if (min === 0) return 100;
  const pct = Math.round((current / (min * 3)) * 100);
  return Math.min(pct, 100);
}

export default function StockList() {
  const mountedRef = useRef(true);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [criticalCount, setCriticalCount] = useState(0);
  const [lowCount, setLowCount] = useState(0);
  const [page, setPage] = useState(1);
  const [manageProductId, setManageProductId] = useState(null);
  const limit = 10;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (tab === 'low') params.sort = 'quantity_asc';
      const res = await productService.getAll(params);
      if (!mountedRef.current) return;
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : data.products || data.data || [];

      setAllProducts(list);

      let crit = 0, low = 0;
      list.forEach((p) => {
        const s = getStatus(p.current_quantity, p.min_quantity);
        if (s === 'critical') crit++;
        else if (s === 'low') low++;
      });
      setCriticalCount(crit);
      setLowCount(low);
    } catch {
      if (mountedRef.current) {
        setAllProducts([]);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [search, tab]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const filtered = allProducts.filter((p) => {
    if (tab === 'low') {
      const s = getStatus(p.current_quantity, p.min_quantity);
      return s === 'low' || s === 'critical';
    }
    if (tab === 'critical') {
      return getStatus(p.current_quantity, p.min_quantity) === 'critical';
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Stock Overview" />

        <div className="dash-content">
          {/* Stat cards */}
          <div className="stats-row">
            <div className="rh-stat-card">
              <div className="rh-stat-info">
                <span className="rh-stat-label">CRITICAL</span>
                <span className="rh-stat-value" style={{ color: '#b91c1c' }}>{criticalCount}</span>
              </div>
              <div className="rh-stat-icon" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                <Icon.CritGauge />
              </div>
            </div>
            <div className="rh-stat-card">
              <div className="rh-stat-info">
                <span className="rh-stat-label">LOW STOCK</span>
                <span className="rh-stat-value" style={{ color: '#c2410c' }}>{lowCount}</span>
              </div>
              <div className="rh-stat-icon" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>
                <Icon.Warn />
              </div>
            </div>
          </div>

          {/* Search + Tabs */}
          <div className="stk-toolbar">
            <div className="stk-search-wrap">
              <div className="stk-search-icon"><Icon.Search /></div>
              <input
                className="stk-search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="stk-tabs">
              <button className={`stk-tab${tab === 'all' ? ' active' : ''}`} onClick={() => setTab('all')}>All Stock</button>
              <button className={`stk-tab${tab === 'low' ? ' active' : ''}`} onClick={() => setTab('low')}>Low Stock</button>
              <button className={`stk-tab${tab === 'critical' ? ' active' : ''}`} onClick={() => setTab('critical')}>Out of Stock</button>
            </div>
          </div>

          {/* Table */}
          <section className="stk-table-card">
            <div className="stk-table-head">
              <div className="stk-th">PRODUCT DETAILS</div>
              <div className="stk-th">CATEGORY</div>
              <div className="stk-th">STOCK LEVEL</div>
              <div className="stk-th">QTY</div>
              <div className="stk-th right">ACTION</div>
            </div>

            {loading ? (
              <div className="stk-empty">Loading stock data...</div>
            ) : paginated.length === 0 ? (
              <div className="stk-empty">No products found</div>
            ) : (
              paginated.map((p, i) => {
                const qty = p.current_quantity ?? p.quantity ?? 0;
                const minQty = p.min_quantity ?? 0;
                const status = getStatus(qty, minQty);
                const fill = getFillPercent(qty, minQty);

                return (
                  <div className={`stk-row${i > 0 ? ' stk-row--bordered' : ''}`} key={p.product_id || p.id || i}>
                    <div className="stk-cell stk-cell--product">
                      <div className="stk-thumb">
                        <div className="stk-thumb-inner">
                          {(p.name || '?').charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="stk-product-name">{p.name}</div>
                        <div className="stk-product-sku">SKU-{p.product_id || p.id}</div>
                      </div>
                    </div>

                    <div className="stk-cell">
                      <span className="stk-chip">{p.category_name || '—'}</span>
                    </div>

                    <div className="stk-cell stk-cell--level">
                      <div className="stk-stock-top">
                        <span className={`stk-status stk-status--${status}`}>{getStatusLabel(status)}</span>
                        <span className="stk-min">Min: {minQty}</span>
                      </div>
                      <div className="stk-track">
                        <div className={`stk-fill stk-fill--${status}`} style={{ width: `${fill}%` }} />
                      </div>
                    </div>

                    <div className="stk-cell">
                      <span className={`stk-qty${status !== 'healthy' ? ` stk-qty--${status}` : ''}`}>{qty}</span>
                    </div>

                    <div className="stk-cell right">
                      {status === 'healthy' ? (
                        <button className="stk-btn-manage" onClick={() => setManageProductId(p.product_id || p.id)}>
                          <Icon.Edit />
                          Manage
                        </button>
                      ) : (
                        <button className="stk-btn-restock" onClick={() => setManageProductId(p.product_id || p.id)}>
                          <Icon.Cart />
                          Restock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="stk-footer">
              <div className="stk-showing">
                Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, filtered.length)}</b> of <b>{filtered.length}</b> products
              </div>
              <div className="stk-pagination">
                <button className="stk-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page">
                  <Icon.ChevL />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={`stk-page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>
                    {n}
                  </button>
                ))}
                <button className="stk-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Next page">
                  <Icon.ChevR />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {manageProductId && (
        <ManageStockModal
          productId={manageProductId}
          onClose={() => setManageProductId(null)}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  )
}
