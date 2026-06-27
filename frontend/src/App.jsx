import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/shared/Login';
import AdminRoutes from './routes/AdminRoutes';
import ForgotPasswordFlow from './pages/shared/ForgotPasswordFlow';
// import ClientRoutes from './routes/ClientRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* <Route path="/client/*" element={<ClientRoutes />} /> */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



