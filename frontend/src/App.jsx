import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useEffect } from 'react';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SoilInfoPage from './pages/SoilInfoPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';

// Language Switcher Component
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <select 
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="en">English</option>
        <option value="ne">नेपाली</option>
        <option value="lep">ᰛᰩᰵᰛᰧᰵᰶ (Lepcha)</option>
        <option value="sik">सिक्किमी (Sikkimese)</option>
      </select>
    </div>
  );
};

// Public Route Wrapper - Prevents authenticated users from accessing auth pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

// Root route handler - Simple redirect based on auth status
const RootRoute = () => {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/soil-info" element={<SoilInfoPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        
        {/* Root and catch-all routes */}
        <Route path="/" element={<RootRoute />} />
        <Route path="*" element={<RootRoute />} />
      </Routes>
      <LanguageSwitcher />
    </AuthProvider>
  );
}

export default App;
