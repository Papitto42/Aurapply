import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardHome from './pages/DashboardHome';
import Discover from './pages/Discover';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

export const AuthContext = React.createContext(null);

function AppContent() {
  const location = useLocation();
  const DEV_MODE = true;

  return (
    <>
      <Routes>
        {/* All Routes - No Authentication Required in Dev Mode */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/discover" element={<Discover />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Show Navbar on all pages except auth, landing page, and main menu pages */}
      {DEV_MODE && location.pathname !== '/auth' && location.pathname !== '/' && 
       location.pathname !== '/dashboard' && location.pathname !== '/analytics' && 
       location.pathname !== '/settings' && location.pathname !== '/discover' && <Navbar />}
    </>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize app - read token from localStorage
    const initApp = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      } finally {
        // Always set loading to false, with a delay to show loading screen
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    initApp();

    // Listen for storage changes (when token is set/removed in other tabs/components)
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Create a wrapper for setToken that also syncs with localStorage
  const setTokenWithSync = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ token, setToken: setTokenWithSync }}>
      <Router>
        <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-orange-500 selection:text-white" style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#E0E0E0' }}>
          <AppContent />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
