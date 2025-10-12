import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/Campaigns';
import CreateCampaign from './pages/CampaignMaintenance';
import CampaignDetail from './pages/CampaignDetail';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/login" replace />} 
            />

            <Route 
              path="/login" 
              element={<LoginPage />} 
            />

            <Route 
              path='/register'
              element={
                <RegisterPage></RegisterPage>
              }
            />

            <Route
              path='/campaigns'
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/campaigns/maintenance"
              element={
                <ProtectedRoute allowedRole={1}>
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />

            <Route 
              path='/campaigns/detail'
              element={
                <ProtectedRoute>
                  <CampaignDetail />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="*" 
              element={<div>404 Not Found</div>} 
            />
          </Routes>
        </BrowserRouter>
      </CampaignProvider>
    </AuthProvider>
  );
}

export default App;