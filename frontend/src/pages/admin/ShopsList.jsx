import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import shopService from '../../services/shopService';
import '../../styles/shopsList.css';

const PAGE_SIZE = 10;

const palette = [
  { color: "#a04100", bg: "rgba(255,219,204,0.3)" },
  { color: "#0062a1", bg: "rgba(208,228,255,0.3)" },
  { color: "#5a4136", bg: "rgba(226,191,176,0.3)" },
  { color: "#1b7a2e", bg: "rgba(200,230,201,0.3)" },
  { color: "#7b4ea3", bg: "rgba(243,229,255,0.3)" },
];

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function pickPalette(id) {
  return palette[id % palette.length];
}

function SearchIcon() {
  return (
    <svg className="shops-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M12.5 11h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.5 6.5 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L12.5 11zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z" fill="#5f5e5e"/>
    </svg>
  );
}

function NotifIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M16 17H0v-2l2-2V8c0-3.31 2.69-6 6-6s6 2.69 6 6v5l2 2v2zM8 20a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z" fill="#5f5e5e"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z" fill="white"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 0C3.36 0 0 3.36 0 7.5S3.36 15 7.5 15 15 11.64 15 7.5 11.64 0 7.5 0zm6.5 7.5c0 .9-.18 1.76-.49 2.55L10 7.17V5.5c0-.83-.67-1.5-1.5-1.5h-3V3l-1.5.75L2.5 3v1.5L0 6.75V5.95C.44 3.02 2.93.75 6 .5v.75c0 .41.34.75.75.75H8v1.25c0 .41.34.75.75.75h2.5l2.75 2.75v0z" fill="white"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="7.4" viewBox="0 0 12 7.4" fill="none">
      <path d="M6 7.4L0 1.4 1.4 0 6 4.6 10.6 0 12 1.4z" fill="#5f5e5e"/>
    </svg>
  );
}

function StatusBadge({ active }) {
  const cls = active ? "active" : "inactive";
  return (
    <span className={`shops-status-badge ${cls}`}>
      <span className={`shops-status-dot ${cls}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatGrowthRate(thisMonth, lastMonth) {
  if (lastMonth === 0) return thisMonth > 0 ? "+100%" : "0%";
  const rate = ((thisMonth - lastMonth) / lastMonth) * 100;
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(1)}%`;
}

const ShopsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ total: 0, new_today: 0, this_month: 0, last_month: 0, unresolved_alerts: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const fetchShops = async (page, term = '') => {
    const res = await shopService.getAll(page, PAGE_SIZE, term);
    const body = res?.data?.data || res?.data || {};
    const rows = body.rows || [];
    setShops(rows);
    setCurrentPage(page);
    setTotalPages(Math.ceil((body.total || 0) / PAGE_SIZE));
    return body.total || 0;
  };

  const fetchStats = async () => {
    const res = await shopService.getStats();
    const data = res?.data?.data || {};
    setStats(prev => ({ ...prev, ...data }));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchShops(1), fetchStats()]);
      } catch (err) {
        console.error('Error loading shops list:', err);
        setShops([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchShops(1, value);
    }, 300);
  };

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    try {
      await fetchShops(page, search);
    } catch (err) {
      console.error('Error fetching page:', err);
    }
  };

  const buildPaginationItems = () => {
    const items = [];
    items.push("‹");
    for (let i = 1; i <= Math.min(3, totalPages); i++) items.push(String(i));
    if (totalPages > 4) items.push("…");
    if (totalPages > 3) items.push(String(totalPages));
    items.push("›");
    return items;
  };

  const growthRate = formatGrowthRate(stats.this_month, stats.last_month);

  const bento = [
    {
      label: "GROWTH RATE",
      value: growthRate,
      sub: "↑ vs last month",
      subColor: "#16a34a",
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      label: "NEW SHOPS TODAY",
      value: String(stats.new_today),
      sub: "Direct recruitment",
      subColor: "#a04100",
      iconBg: "rgba(255,219,204,0.3)",
      iconColor: "#a04100",
    },
    {
      label: "ALERTS",
      value: String(stats.unresolved_alerts),
      sub: "Requires attention",
      subColor: "#5f5e5e",
      iconBg: "#ffdad6",
      iconColor: "#ba1a1a",
    },
  ];

  if (loading && shops.length === 0) {
    return (
      <div className="shops-loading">
        <div className="shops-spinner"></div>
        <p>Loading shops...</p>
      </div>
    );
  }

  return (
    <div className="shops-page">
      <AdminSidebar />

      <div className="shops-main">
        <div className="shops-topbar">
          <div className="shops-topbar-left">
            <span className="shops-topbar-title">All Shops</span>
            <span className="shops-total-badge">{stats.total} Total</span>
          </div>
          <div className="shops-topbar-actions">
            <button className="shops-notif-btn">
              <NotifIcon />
              <span className="shops-notif-dot" />
            </button>
            <button className="shops-lang-btn">
              <GlobeIcon />
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        <div className="shops-action-bar">
          <div className="shops-search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, owner, or city..."
              className="shops-search-input"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <button className="shops-btn-add" onClick={() => navigate('/admin/shops/add')}>
            <PlusIcon />
            Add New Shop
          </button>
        </div>

        <div className="shops-table-wrap">
          <div className="shops-table">
            <div className="shops-col-header-row">
              {["SHOP NAME","OWNER","ADDRESS","PHONE","STATUS","ACTIONS"].map((h, i) => (
                <div key={h} className={`shops-col-header${i === 5 ? ' right' : ''}`}>{h}</div>
              ))}
            </div>

            {shops.length > 0 ? (
              shops.map((s, i) => {
                const p = pickPalette(s.shop_id);
                return (
                  <div key={s.shop_id} className={`shops-row${i % 2 === 1 ? ' alt' : ''}`}>
                    <div className="shops-name-cell">
                      <div className="shops-avatar" style={{ backgroundColor: p.bg, color: p.color }}>
                        {getInitials(s.shop_name)}
                      </div>
                      <span className="shops-name">{s.shop_name}</span>
                    </div>
                    <div className="shops-cell">{s.owner_name || "N/A"}</div>
                    <div className="shops-cell">{s.address || "N/A"}</div>
                    <div className="shops-cell">{s.phone || "N/A"}</div>
                    <div className="shops-cell">
                      <StatusBadge active={s.active} />
                    </div>
                    <div className="shops-cell" style={{ textAlign: 'right' }}>
                      <button className="shops-btn-view" onClick={() => navigate(`/admin/shops/${s.shop_id}`)}>
                        View<br />Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="shops-empty">No shops found</div>
            )}

            <div className="shops-pagination">
              <span className="shops-pagination-info">
                Showing <strong>{Math.min((currentPage - 1) * PAGE_SIZE + 1, stats.total)}-{Math.min(currentPage * PAGE_SIZE, stats.total)}</strong> of <strong>{stats.total}</strong> shops
              </span>
              <div className="shops-pagination-btns">
                {buildPaginationItems().map((p, idx) => {
                  const isNum = !isNaN(p) && p !== "…" && p !== "‹" && p !== "›";
                  const pageNum = isNum ? parseInt(p) : null;
                  const isActive = pageNum === currentPage;
                  const isNav = p === "‹" || p === "›";
                  return (
                    <button
                      key={`${p}-${idx}`}
                      className={`shops-page-btn${isActive ? ' active' : ''}`}
                      onClick={() => {
                        if (isNav && p === "‹" && currentPage > 1) handlePageChange(currentPage - 1);
                        else if (isNav && p === "›" && currentPage < totalPages) handlePageChange(currentPage + 1);
                        else if (pageNum) handlePageChange(pageNum);
                      }}
                      disabled={isNav && ((p === "‹" && currentPage === 1) || (p === "›" && currentPage === totalPages))}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shops-bento-grid">
            {bento.map((c) => (
              <div key={c.label} className="shops-bento-card">
                <div>
                  <p className="shops-bento-label">{c.label}</p>
                  <p className="shops-bento-value">{c.value}</p>
                  <p className="shops-bento-sub" style={{ color: c.subColor }}>{c.sub}</p>
                </div>
                <div className="shops-bento-icon" style={{ backgroundColor: c.iconBg }}>
                  <span style={{ color: c.iconColor }}>↑</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopsList;
