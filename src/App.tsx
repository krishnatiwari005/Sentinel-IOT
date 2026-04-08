import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveAlerts } from './pages/LiveAlerts';
import { HistoryLog } from './pages/HistoryLog';
import { VipManagement } from './pages/VipManagement';
import { Settings } from './pages/Settings';
import { DeviceSetup } from './pages/DeviceSetup';
import { useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { session, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<LiveAlerts />} />
        <Route path="/history" element={<HistoryLog />} />
        <Route path="/vips" element={<VipManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route 
          path="/setup" 
          element={isAdmin ? <DeviceSetup /> : <Navigate to="/" replace />} 
        />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
