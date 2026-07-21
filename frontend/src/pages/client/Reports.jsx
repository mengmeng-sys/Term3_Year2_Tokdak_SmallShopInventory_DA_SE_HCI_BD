import { useState, useEffect, useCallback } from 'react';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import reportService from '../../services/reportService';
import { formatDateTime } from '../../utils/formatDate';
import '../../styles/adminDashboard.css';
import '../../styles/reports.css';

const PAGE_SIZE = 10;

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [mostRestocked, setMostRestocked] = useState([]);
  const [mostSold, setMostSold] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);

  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, restockRes, soldRes] = await Promise.all([
        reportService.getSummary(),
        reportService.getMostRestocked(),
        reportService.getMostSold(),
      ]);
      setSummary(sumRes?.data?.data || sumRes?.data || null);
      setMostRestocked(restockRes?.data?.data || restockRes?.data || []);
      setMostSold(soldRes?.data?.data || soldRes?.data || []);
    } catch {
      setSummary(null);
      setMostRestocked([]);
      setMostSold([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const res = await reportService.getHistory(params);
      setHistory(res?.data?.data || res?.data || []);
      setHistoryPage(1);
    } catch {
      setHistory([]);
    }
  }, [typeFilter, dateFrom, dateTo]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const formatQty = (n) => {
    if (n === undefined || n === null) return '0';
    return Number(n).toLocaleString('en-US');
  };

  const exportCsv = () => {
    if (history.length === 0) return;
    const escape = (v) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };
    const headers = ['Product', 'Type', 'Quantity', 'Unit', 'Note', 'Date'];
    const rows = history.map((tx) => [
      escape(tx.product_name),
      escape(tx.type),
      escape(tx.quantity_changed),
      escape(tx.unit || 'pcs'),
      escape(tx.note || ''),
      escape(formatDateTime(tx.created_at)),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-history.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const pagedHistory = history.slice((historyPage - 1) * PAGE_SIZE, historyPage * PAGE_SIZE);

  if (loading) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <Topbar title="Reports" />
          <div className="dash-content">
            <div className="dash-loading">
              <div className="dash-spinner"></div>
              <p>Loading reports...</p>
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
        <Topbar title="Reports" />
        <div className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Reports</h1>
              <p className="dash-page-subtitle">Stock movement overview for your shop.</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="rpt-summary-row">
            <div className="rpt-summary-card" style={{ borderLeftColor: '#15803d' }}>
              <div className="rpt-summary-icon" style={{ background: '#e8f5e9', color: '#15803d' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <p className="rpt-summary-label">TOTAL RESTOCKS</p>
              <span className="rpt-summary-value" style={{ color: '#15803d' }}>{formatQty(summary?.total_restocks)}</span>
            </div>
            <div className="rpt-summary-card" style={{ borderLeftColor: '#1565c0' }}>
              <div className="rpt-summary-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="rpt-summary-label">TOTAL SALES</p>
              <span className="rpt-summary-value" style={{ color: '#1565c0' }}>{formatQty(summary?.total_sales)}</span>
            </div>
            <div className="rpt-summary-card" style={{ borderLeftColor: '#22c55e' }}>
              <div className="rpt-summary-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <p className="rpt-summary-label">QUANTITY ADDED</p>
              <span className="rpt-summary-value" style={{ color: '#22c55e' }}>{formatQty(summary?.total_quantity_added)}</span>
            </div>
            <div className="rpt-summary-card" style={{ borderLeftColor: '#ef4444' }}>
              <div className="rpt-summary-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                  <polyline points="17 18 23 18 23 12"/>
                </svg>
              </div>
              <p className="rpt-summary-label">QUANTITY SOLD</p>
              <span className="rpt-summary-value" style={{ color: '#ef4444' }}>{formatQty(summary?.total_quantity_sold)}</span>
            </div>
          </div>

          {/* Most Restocked & Most Sold */}
          <div className="rpt-two-col">
            {/* Most Restocked */}
            <div className="rpt-leaderboard">
              <div className="rpt-leaderboard-head">
                <h3 className="rpt-leaderboard-title">Most Restocked</h3>
                <span className="rpt-leaderboard-count">Top {Math.min(mostRestocked.length, 10)}</span>
              </div>
              <div className="rpt-leaderboard-table">
                <div className="rpt-lb-head">
                  <div className="rpt-lb-th">#</div>
                  <div className="rpt-lb-th">Product</div>
                  <div className="rpt-lb-th">Restocks</div>
                  <div className="rpt-lb-th right">Qty Added</div>
                </div>
                {mostRestocked.length > 0 ? (
                  mostRestocked.map((item, i) => (
                    <div key={i} className={`rpt-lb-row ${i % 2 === 1 ? 'alt' : ''}`}>
                      <div className={`rpt-lb-rank ${i < 3 ? 'top' : ''}`}>{i + 1}</div>
                      <div className="rpt-lb-name">{item.name}</div>
                      <div className="rpt-lb-count">{formatQty(item.restock_count)}</div>
                      <div className="rpt-lb-qty" style={{ color: '#15803d' }}>{formatQty(item.total_added)} {item.unit || 'pcs'}</div>
                    </div>
                  ))
                ) : (
                  <div className="rpt-lb-empty">No restock data yet</div>
                )}
              </div>
            </div>

            {/* Most Sold */}
            <div className="rpt-leaderboard">
              <div className="rpt-leaderboard-head">
                <h3 className="rpt-leaderboard-title">Most Sold</h3>
                <span className="rpt-leaderboard-count">Top {Math.min(mostSold.length, 10)}</span>
              </div>
              <div className="rpt-leaderboard-table">
                <div className="rpt-lb-head">
                  <div className="rpt-lb-th">#</div>
                  <div className="rpt-lb-th">Product</div>
                  <div className="rpt-lb-th">Sales</div>
                  <div className="rpt-lb-th right">Qty Sold</div>
                </div>
                {mostSold.length > 0 ? (
                  mostSold.map((item, i) => (
                    <div key={i} className={`rpt-lb-row ${i % 2 === 1 ? 'alt' : ''}`}>
                      <div className={`rpt-lb-rank ${i < 3 ? 'top' : ''}`}>{i + 1}</div>
                      <div className="rpt-lb-name">{item.name}</div>
                      <div className="rpt-lb-count">{formatQty(item.sale_count)}</div>
                      <div className="rpt-lb-qty" style={{ color: '#1565c0' }}>{formatQty(item.total_sold)} {item.unit || 'pcs'}</div>
                    </div>
                  ))
                ) : (
                  <div className="rpt-lb-empty">No sales data yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="rpt-history-card">
            <div className="rpt-history-header">
              <h3 className="rpt-history-title">Transaction History</h3>
              <button
                className="rpt-export-btn"
                onClick={exportCsv}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            </div>

            <div className="rpt-filters">
              <div className="rpt-filter-group">
                <span className="rpt-filter-label">Type</span>
                <div className="rpt-filter-tabs">
                  {[
                    { value: '', label: 'All' },
                    { value: 'restock', label: 'Restock' },
                    { value: 'sale', label: 'Sale' },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      className={`rpt-filter-tab ${typeFilter === tab.value ? 'active' : ''}`}
                      onClick={() => setTypeFilter(tab.value)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rpt-filter-group">
                <span className="rpt-filter-label">From</span>
                <input
                  type="date"
                  className="rpt-date-input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="rpt-filter-group">
                <span className="rpt-filter-label">To</span>
                <input
                  type="date"
                  className="rpt-date-input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {history.length > 0 ? (
              <>
                <div className="rpt-history-table-head">
                  <div className="rpt-th">PRODUCT</div>
                  <div className="rpt-th">TYPE</div>
                  <div className="rpt-th">QUANTITY</div>
                  <div className="rpt-th">NOTE</div>
                  <div className="rpt-th">DATE</div>
                </div>
                {pagedHistory.map((tx, i) => {
                  const absQty = Math.abs(tx.quantity_changed);
                  const isRestock = tx.type === 'restock';
                  return (
                    <div key={tx.transaction_id || i} className={`rpt-history-row ${((historyPage - 1) * PAGE_SIZE + i) % 2 === 1 ? 'alt' : ''}`}>
                      <div className="rpt-h-cell bold">{tx.product_name}</div>
                      <div className="rpt-h-cell">
                        <span className={`rpt-type-badge ${isRestock ? 'restock' : 'sale'}`}>
                          {isRestock ? 'Restock' : 'Sale'}
                        </span>
                      </div>
                      <div className="rpt-h-cell">
                        <span className={`rpt-h-qty ${isRestock ? 'positive' : 'negative'}`}>
                          {isRestock ? '+' : '-'}{formatQty(absQty)} {tx.unit || 'pcs'}
                        </span>
                      </div>
                      <div className="rpt-h-cell">
                        <span className="rpt-h-note" title={tx.note || ''}>{tx.note || '—'}</span>
                      </div>
                      <div className="rpt-h-cell">
                        <span className="rpt-h-date">{formatDateTime(tx.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="rpt-empty">No transactions found</div>
            )}

            {totalPages > 1 && (
              <div className="rpt-pagination">
                <div className="rpt-pagination-info">
                  Showing <b>{(historyPage - 1) * PAGE_SIZE + 1}</b>–<b>{Math.min(historyPage * PAGE_SIZE, history.length)}</b> of <b>{history.length}</b>
                </div>
                <div className="rpt-pagination-buttons">
                  <button
                    className="rpt-page-btn"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage((p) => p - 1)}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`rpt-page-btn ${p === historyPage ? 'active' : ''}`}
                      onClick={() => setHistoryPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="rpt-page-btn"
                    disabled={historyPage === totalPages}
                    onClick={() => setHistoryPage((p) => p + 1)}
                  >
                    ›
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

export default Reports;
