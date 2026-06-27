import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ClientDashboard from '../pages/client/Dashboard';
import CategoryManagement from '../pages/client/CategoryManagement';
import ProductManagement from '../pages/client/ProductManagement';
import StockList from '../pages/client/StockList';
import ProductDetails from '../pages/client/ProductDetails';
import AddProduct from '../pages/client/AddProduct';
import RestockProduct from '../pages/client/RestockProduct';
import RestockConfirmation from '../pages/client/RestockConfirmation';
import AlertCenter from '../pages/client/AlertCenter';
import RestockHistory from '../pages/client/RestockHistory';
import Reports from '../pages/client/Reports';
import ClientProfile from '../pages/client/Profile';
import Settings from '../pages/client/Settings';
import AccountSecurity from '../pages/client/AccountSecurity';

function ClientRoutes() {
  return (
    <ProtectedRoute allowedRole="client">
      <Routes>
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="stock" element={<StockList />} />
        <Route path="stock/restock/:id" element={<RestockProduct />} />
        <Route path="stock/restock/:id/confirm" element={<RestockConfirmation />} />
        <Route path="alerts" element={<AlertCenter />} />
        <Route path="restock-history" element={<RestockHistory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="security" element={<AccountSecurity />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default ClientRoutes;
