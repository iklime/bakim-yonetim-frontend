import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './context/AuthContext';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import BreakdownListPage from './pages/BreakdownListPage';
import StockListPage from './pages/StockListPage';
import PredictionPage from './pages/PredictionPage';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route
          path="/equipment"
          element={user ? <EquipmentListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/equipment/:id"
          element={user ? <EquipmentDetailPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/breakdowns"
          element={user ? <BreakdownListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/stock"
          element={user ? <StockListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/predictions"
          element={user ? <PredictionPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;