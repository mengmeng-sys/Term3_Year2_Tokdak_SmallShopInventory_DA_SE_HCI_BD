import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import userService from '../../services/userService';
import '../../styles/userManagement.css';

const PAGE_SIZE = 10;

function SearchIcon() {
  return (
    <svg className="um-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M12.5 11h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.5 6.5 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L12.5 11zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z" fill="#5f5e5e"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z" fill="white"/>
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

function TrashIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path d="M5 0h6l1 2H4l1-2zM0 3h16v2H0V3zm2 3h12l-1 12H3L2 6zm4 3v6m4-6v6" stroke="#ba1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function getUserInitials(user) {
  if (!user?.name) return 'A';
  return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debounceRef = useRef(null);

  const fetchUsers = useCallback(async (page, term, status) => {
    const res = await userService.getAll(page, PAGE_SIZE, term, status);
    const body = res?.data?.data || res?.data || {};
    const rows = body.rows || [];
    setUsers(rows);
    setTotal(body.total || 0);
    setCurrentPage(page);
    setTotalPages(Math.ceil((body.total || 0) / PAGE_SIZE));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchUsers(1, '', '');
      } catch (err) {
        console.error('Error loading users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUsers(1, value, statusFilter);
    }, 300);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    fetchUsers(1, search, value);
  };

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    try {
      await fetchUsers(page, search, statusFilter);
    } catch (err) {
      console.error('Error fetching page:', err);
    }
  };

  const handleToggle = async (userId, currentActive) => {
    try {
      await userService.toggleStatus(userId, !currentActive);
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_active: !currentActive } : u));
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.remove(userId);
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      setTotal(prev => prev - 1);
      alert('User deleted successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete user';
      alert(msg);
    }
  };

  const buildPaginationItems = () => {
    const items = ['‹'];
    for (let i = 1; i <= Math.min(3, totalPages); i++) items.push(String(i));
    if (totalPages > 4) items.push('…');
    if (totalPages > 3) items.push(String(totalPages));
    items.push('›');
    return items;
  };

  if (loading && users.length === 0) {
    return (
      <div className="um-loading">
        <div className="um-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="um-page">
      <AdminSidebar />

      <div className="um-main">
        <div className="um-topbar">
          <span className="um-topbar-title">User Management</span>
          <div className="um-topbar-right">
            <NotificationDropdown />
            <div className="um-admin-badge">{user ? getUserInitials(user) : 'A'}</div>
          </div>
        </div>

        <div className="um-content">
          <div className="um-controls">
            <div className="um-search-wrap">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="um-search-input"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="um-controls-right">
              <div className="um-filter-wrap">
                <select className="um-filter-select" value={statusFilter} onChange={handleFilterChange}>
                  <option value="">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className="um-filter-chevron"><ChevronDownIcon /></span>
              </div>
              <button className="um-btn-new-user" onClick={() => navigate('/admin/shops/add')}>
                <PlusIcon />
                New User
              </button>
            </div>
          </div>

          <div className="um-table">
            <div className="um-col-header-row">
              {['Name', 'Email', 'Created Date', 'Status', 'Active', 'Actions'].map((h, i) => (
                <div key={h} className={`um-col-header${i === 5 ? ' right' : ''}`}>{h}</div>
              ))}
            </div>

            {users.length > 0 ? (
              users.map((u) => (
                <div key={u.user_id} className="um-row">
                  <div className="um-cell name">{u.name}</div>
                  <div className="um-cell">{u.email}</div>
                  <div className="um-cell">{formatDate(u.created_at)}</div>
                  <div className="um-cell">
                    <span className={`um-status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                      {u.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="um-cell center">
                    <button
                      className={`um-toggle ${u.is_active ? 'on' : 'off'}`}
                      onClick={() => handleToggle(u.user_id, u.is_active)}
                      title={u.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <span className="um-toggle-thumb" />
                    </button>
                  </div>
                  <div className="um-cell right">
                    <button className="um-btn-delete" onClick={() => handleDelete(u.user_id)} title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="um-empty">No users found</div>
            )}

            <div className="um-pagination">
              <span className="um-pagination-info">
                Showing <strong>{Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}-{Math.min(currentPage * PAGE_SIZE, total)}</strong> of <strong>{total}</strong> users
              </span>
              <div className="um-pagination-btns">
                {buildPaginationItems().map((p, idx) => {
                  const isNum = !isNaN(p) && p !== '…' && p !== '‹' && p !== '›';
                  const pageNum = isNum ? parseInt(p) : null;
                  const isActive = pageNum === currentPage;
                  const isNav = p === '‹' || p === '›';
                  return (
                    <button
                      key={`${p}-${idx}`}
                      className={`um-page-btn${isActive ? ' active' : ''}`}
                      onClick={() => {
                        if (isNav && p === '‹' && currentPage > 1) handlePageChange(currentPage - 1);
                        else if (isNav && p === '›' && currentPage < totalPages) handlePageChange(currentPage + 1);
                        else if (pageNum) handlePageChange(pageNum);
                      }}
                      disabled={isNav && ((p === '‹' && currentPage === 1) || (p === '›' && currentPage === totalPages))}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
