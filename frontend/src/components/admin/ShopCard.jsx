// frontend/src/components/admin/ShopCard.jsx
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const ShopCard = ({ shop, onView, onEdit, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  // Status style helper
  const getStatusStyle = (status) => {
    const statusMap = {
      'active': { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
      'pending': { bg: '#fff3e0', color: '#ef6c00', label: 'Pending' },
      'inactive': { bg: '#ffebee', color: '#c62828', label: 'Inactive' },
      'suspended': { bg: '#ffebee', color: '#c62828', label: 'Suspended' }
    };
    return statusMap[status?.toLowerCase()] || statusMap['pending'];
  };

  const status = getStatusStyle(shop.status);

  const handleView = () => {
    if (onView) {
      onView(shop);
    } else {
      navigate(`/admin/shops/${shop.shop_id || shop.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(shop);
    } else {
      navigate(`/admin/shops/edit/${shop.shop_id || shop.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(shop);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden transition-shadow hover:shadow-md"
      style={{ 
        border: '1px solid #e2bfb0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      {/* Shop header with status */}
      <div className="p-4 border-b" style={{ borderBottom: '1px solid #e2bfb0' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-[#1A1A1A] text-lg truncate">
              {shop.shop_name || shop.name || 'Unnamed Shop'}
            </h3>
            <p className="text-[#555555] text-sm truncate">
              {shop.owner_name || shop.owner || 'No owner assigned'}
            </p>
          </div>
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Shop details */}
      <div className="p-4 space-y-2">
        <div className="flex items-center text-sm">
          <span style={{ width: '80px', color: '#888888' }}>Phone</span>
          <span className="text-[#1A1A1A]">{shop.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center text-sm">
          <span style={{ width: '80px', color: '#888888' }}>Address</span>
          <span className="text-[#1A1A1A] truncate">{shop.address || 'N/A'}</span>
        </div>
        <div className="flex items-center text-sm">
          <span style={{ width: '80px', color: '#888888' }}>Registered</span>
          <span className="text-[#1A1A1A]">{formatDate(shop.created_at || shop.createdAt)}</span>
        </div>
        {shop.total_products !== undefined && (
          <div className="flex items-center text-sm">
            <span style={{ width: '80px', color: '#888888' }}>Products</span>
            <span className="text-[#1A1A1A] font-semibold">{shop.total_products || 0}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-[#f5f3f3] flex gap-2" style={{ borderTop: '1px solid #e2bfb0' }}>
          <button
            onClick={handleView}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#ff6b00' }}
          >
            View Details
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#1A1A1A] bg-white transition-colors"
            style={{ border: '1px solid #e2bfb0' }}
          >
            Edit
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#c62828' }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopCard;