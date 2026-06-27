// frontend/src/components/admin/UserRow.jsx
import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

const UserRow = ({ 
  user, 
  index, 
  onView, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  showActions = true,
  striped = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status style helper
  const getStatusStyle = (status) => {
    const statusMap = {
      'active': { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
      'inactive': { bg: '#ffebee', color: '#c62828', label: 'Inactive' },
      'suspended': { bg: '#ffebee', color: '#c62828', label: 'Suspended' },
      'pending': { bg: '#fff3e0', color: '#ef6c00', label: 'Pending' }
    };
    return statusMap[status?.toLowerCase()] || statusMap['pending'];
  };

  // Role style helper
  const getRoleStyle = (role) => {
    const roleMap = {
      'admin': { bg: '#ff6b00', color: 'white', label: 'Admin' },
      'client': { bg: '#e8f5e9', color: '#2e7d32', label: 'Client' }
    };
    return roleMap[role?.toLowerCase()] || roleMap['client'];
  };

  const status = getStatusStyle(user.status);
  const role = getRoleStyle(user.role);

  const handleView = () => {
    if (onView) {
      onView(user);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(user);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      onDelete(user);
    }
  };

  return (
    <>
      {/* Main row */}
      <div 
        className="grid items-center hover:bg-[#fafafa] transition-colors"
        style={{ 
          gridTemplateColumns: '0.5fr 1.5fr 2fr 1.2fr 1fr 1.2fr 1fr',
          backgroundColor: striped && index % 2 === 1 ? '#fafafa' : 'white',
          borderTop: index > 0 ? '1px solid rgba(226,191,176,0.3)' : 'none'
        }}
      >
        {/* Index */}
        <div className="px-4 py-4 text-[#888888] text-sm text-center">
          {index + 1}
        </div>

        {/* Name with avatar */}
        <div className="px-4 py-4 flex items-center gap-3">
          <div 
            className="rounded-full size-8 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#ff6b00' }}
          >
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
          <div>
            <div className="font-semibold text-[#1A1A1A] text-sm">{user.name || 'N/A'}</div>
            <div className="text-[#888888] text-xs">{user.email || 'N/A'}</div>
          </div>
        </div>

        {/* Email */}
        <div className="px-4 py-4 text-[#555555] text-sm truncate">
          {user.email || 'N/A'}
        </div>

        {/* Role */}
        <div className="px-4 py-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: role.bg, color: role.color }}
          >
            {role.label}
          </span>
        </div>

        {/* Status */}
        <div className="px-4 py-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* Registered Date */}
        <div className="px-4 py-4 text-[#555555] text-sm">
          {formatDate(user.created_at || user.createdAt)}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="px-4 py-4 flex items-center gap-1">
            <button
              onClick={handleView}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="View Details"
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '16px' }}>👁️</span>
            </button>
            <button
              onClick={handleEdit}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Edit User"
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '16px' }}>✏️</span>
            </button>
            <button
              onClick={handleToggleStatus}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              {user.status === 'active' ? (
                <span style={{ fontSize: '16px' }}>⏸️</span>
              ) : (
                <span style={{ fontSize: '16px' }}>▶️</span>
              )}
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded hover:bg-red-50 transition-colors"
                title="Delete User"
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '16px' }}>🗑️</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded details (optional) */}
      {isExpanded && (
        <div 
          className="px-4 py-3 text-sm"
          style={{ 
            gridColumn: '1 / -1',
            backgroundColor: striped && index % 2 === 1 ? '#fafafa' : 'white',
            borderTop: '1px solid rgba(226,191,176,0.2)'
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-[#888888]">User ID:</span>
              <span className="ml-2 text-[#1A1A1A]">{user.user_id || user.id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#888888]">Phone:</span>
              <span className="ml-2 text-[#1A1A1A]">{user.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#888888]">Shop:</span>
              <span className="ml-2 text-[#1A1A1A]">{user.shop_name || user.shop?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle expand button (shown when there's additional data) */}
      {(user.phone || user.shop_name || user.shop?.name) && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#888888] hover:text-[#ff6b00] transition-colors px-4 py-1"
          style={{ 
            gridColumn: '1 / -1',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            paddingLeft: '16px',
            backgroundColor: striped && index % 2 === 1 ? '#fafafa' : 'white'
          }}
        >
          {isExpanded ? '▲ Hide details' : '▼ Show details'}
        </button>
      )}
    </>
  );
};

export default UserRow;