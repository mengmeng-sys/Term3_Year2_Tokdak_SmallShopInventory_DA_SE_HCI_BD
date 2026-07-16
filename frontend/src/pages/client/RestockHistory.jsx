import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClientSidebar from '../../components/common/ClientSidebar';
import stockService from '../../services/stockService';
import { formatDateTime } from '../../utils/formatDate';
import { Package, ArrowUpDown, RefreshCw, ChevronLeft, ChevronRight, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import '../../styles/adminDashboard.css';
import '../../styles/restock-history.css';

const PAGE_SIZE = 8;

const palette = [
  { bg: '#fff3e0', color: '#e65100' },
  { bg: '#e8f5e9', color: '#2e7d32' },
  { bg: '#e3f2fd', color: '#1565c0' },
  { bg: '#fce4ec', color: '#c62828' },
  { bg: '#f3e5f5', color: '#6a1b9a' },
  { bg: '#e0f7fa', color: '#00695c' },
  { bg: '#fff8e1', color: '#f57f17' },
  { bg: '#efebe9', color: '#4e342e' },
];

const getPalette = (id) => palette[id % palette.length];

const RestockHistory = () => {
  const { user, getAvatarUrl } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalAdded, setTotalAdded] = useState(0);
  const [totalSubtracted, setTotalSubtracted] = useState(0);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [productFilter, setProductFilter] = useState('');

  const loadHistory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await stockService.getHistory();
      if (!mountedRef.current) return;
      const body = res?.data?.data || res?.data || [];
      const rows = Array.isArray(body) ? body : body.rows || [];
      setTotal(rows.length);
      setTotalAdded(rows.filter(h => h.quantity_changed > 0).reduce((acc, h) => acc + h.quantity_changed, 0));
      setTotalSubtracted(rows.filter(h => h.quantity_changed < 0).reduce((acc, h) => acc + Math.abs(h.quantity_changed), 0));
      setTotalPages(Math.max(1, Math.ceil(rows.length / PAGE_SIZE)));
      const start = (page - 1) * PAGE_SIZE;
      setHistory(rows.slice(start, start + PAGE_SIZE));
      setCurrentPage(page);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('Error loading restock history:', err);
      setHistory([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadHistory(1);
    return () => { mountedRef.current = false; };
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadHistory(page);
  };

  const handleApplyFilter = () => {
    loadHistory(1);
  };

  const buildPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        items.push(i);
      } else if (items[items.length - 1] !== '...') {
        items.push('...');
      }
    }
    return items;
  };

  if (loading && history.length === 0) {
    return (
      <div className="rh-loading">
        <div className="rh-spinner"></div>
        <p>Loading restock history...</p>
      </div>
    );
  }

  const summary = {
    totalTransactions: total,
    totalAdded,
    totalSubtracted,
  };

  return (
    <div className="dash-page">
      <ClientSidebar />

      <div className="dash-main">
        <div className="dash-topbar" style={{ height: 64 }}>
          <div className="dash-topbar-title">Stock History</div>
          <div className="dash-topbar-actions">
            <button
              className="rh-btn-export"
              onClick={() => {}}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 17px', border: '1px solid #ff6b00',
                borderRadius: 8, background: 'none', color: '#ff6b00',
                fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              <ArrowUpDown size={16} />
              Export to CSV
            </button>
            <div style={{ width: 1, height: 24, backgroundColor: '#e2bfb0' }} />
            <button
              className="rh-bell-btn"
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center',
              }}
            >
              <Bell size={18} color="#5f5e5e" />
              <div style={{
                position: 'absolute', top: 2, right: 0, width: 8, height: 8,
                borderRadius: '50%', backgroundColor: '#ff6b00',
                border: '2px solid #fbf9f8',
              }} />
            </button>
            <div className="dash-topbar-avatar">
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'C'
              )}
            </div>
            <span className="dash-topbar-name">{user?.name || 'Client'}</span>
          </div>
        </div>

        <div className="rh-content">
          {/* Summary cards */}
          <div className="rh-cards-row">
            <div className="rh-stat-card">
              <div className="rh-stat-info">
                <div className="rh-stat-label">TOTAL TRANSACTIONS</div>
                <div className="rh-stat-value">{total}</div>
                <div className="rh-stat-sub">
                  <RefreshCw size={14} color="#16a34a" />
                  <span className="rh-stat-sub-text green">All time history</span>
                </div>
              </div>
              <div className="rh-stat-icon orange">
                <Package size={24} color="#ff6b00" />
              </div>
            </div>

            <div className="rh-stat-card">
              <div className="rh-stat-info">
                <div className="rh-stat-label">TOTAL QUANTITY MOVED</div>
                <div className="rh-stat-value">
                  {summary.totalAdded.toLocaleString()} / {summary.totalSubtracted.toLocaleString()}
                </div>
                <div className="rh-stat-sub">
                  <TrendingUp size={14} color="#16a34a" />
                  <span className="rh-stat-sub-text green">Added</span>
                  <span style={{ color: '#9ca3af', margin: '0 4px' }}>/</span>
                  <TrendingDown size={14} color="#b91c1c" />
                  <span className="rh-stat-sub-text" style={{ color: '#b91c1c' }}>Subtracted</span>
                </div>
              </div>
              <div className="rh-stat-icon blue">
                <Package size={24} color="#0062a1" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rh-filters">
            <div className="rh-filter-field">
              <label className="rh-filter-label">Date Range (From)</label>
              <input
                type="date"
                className="rh-filter-input"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div className="rh-filter-field">
              <label className="rh-filter-label">Date Range (To)</label>
              <input
                type="date"
                className="rh-filter-input"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
            <div className="rh-filter-field">
              <label className="rh-filter-label">Product</label>
              <input
                type="text"
                className="rh-filter-input"
                placeholder="Search product..."
                value={productFilter}
                onChange={e => setProductFilter(e.target.value)}
              />
            </div>
            <button className="rh-btn-apply" onClick={handleApplyFilter}>
              Apply Filter
            </button>
          </div>

          {/* Table */}
          <div className="rh-table-wrap">
            <div className="rh-col-header-row">
              <div className="rh-col-header">PRODUCT NAME</div>
              <div className="rh-col-header">TYPE</div>
              <div className="rh-col-header">QUANTITY</div>
              <div className="rh-col-header">NOTE</div>
              <div className="rh-col-header right">DATE AND TIME</div>
            </div>

            {history.length > 0 ? (
              history.map((h, i) => {
                const p = getPalette(h.product_id || i);
                const isRestock = h.quantity_changed > 0;
                return (
                  <div key={h.transaction_id || i} className="rh-row" style={{ borderTop: i === 0 ? 'none' : undefined }}>
                    <div className="rh-product-cell">
                      <div className="rh-product-avatar" style={{ backgroundColor: p.bg, color: p.color }}>
                        {(h.product_name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <span className="rh-product-name">{h.product_name || 'Unknown Product'}</span>
                    </div>
                    <div className="rh-type-cell">
                      <span className={`rh-type-badge ${isRestock ? 'rh-type-badge--restock' : 'rh-type-badge--sale'}`}>
                        {isRestock ? 'Restock' : 'Sale'}
                      </span>
                    </div>
                    <div className="rh-qty-cell">
                      <span className={`rh-qty-badge ${isRestock ? 'rh-qty-badge--add' : 'rh-qty-badge--subtract'}`}>
                        {isRestock ? '+' : '-'} {Math.abs(h.quantity_changed || 0)}
                      </span>
                    </div>
                    <div className="rh-note-cell">{h.note || '—'}</div>
                    <div className="rh-date-cell">{formatDateTime(h.created_at)}</div>
                  </div>
                );
              })
            ) : (
              <div className="rh-empty">
                <Package size={40} color="#ccc" />
                <p style={{ marginTop: 12 }}>No stock history found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="rh-pagination">
                <span className="rh-pagination-info">
                  Showing <strong>{Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–{Math.min(currentPage * PAGE_SIZE, total)}</strong> of <strong>{total}</strong> transactions
                </span>
                <div className="rh-pagination-btns">
                  <button
                    className="rh-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {buildPaginationItems().map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="rh-page-btn" style={{ border: 'none', background: 'none', cursor: 'default' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`rh-page-btn ${p === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    className="rh-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockHistory;
