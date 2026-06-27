import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import ShopsList from '../pages/admin/ShopsList';
import ShopDetails from '../pages/admin/ShopDetails';
import AddShop from '../pages/admin/AddShop';
import UserManagement from '../pages/admin/UserManagement';
import BackupManagement from '../pages/admin/BackupManagement';
import AdminProfile from '../pages/admin/Profile';

function AdminRoutes() {
  return (
    <ProtectedRoute allowedRole="admin">
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shops" element={<ShopsList />} />
        <Route path="shops/:id" element={<ShopDetails />} />
        <Route path="shops/add" element={<AddShop />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="backups" element={<BackupManagement />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default AdminRoutes;
