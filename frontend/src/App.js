import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardHome from './pages/DashboardHome';
import Discover from './pages/Discover';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from './contexts/ThemeContext';
import { API_ENDPOINTS } from './config/api';

export const AuthContext = React.createContext(null);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  const DEV_MODE = true;

  // Auto-login on mount if no token
  useEffect(() => {
    // If already logged in and on auth page, redirect to dashboard
    if (token && location.pathname === '/auth') {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Auto-login if no token
    if (!token) {
      const autoLogin = async () => {
        try {
          // Try to auto-login with test account
          const response = await axios.post(API_ENDPOINTS.LOGIN, {
            email: 'test@aurapply.com',
            password: 'test123'
          }, { timeout: 5000 });
          
          if (response.data && response.data.token) {
            setToken(response.data.token);
            if (location.pathname === '/' || location.pathname === '/auth') {
              navigate('/dashboard', { replace: true });
            }
          }
        } catch (e) {
          // If auto-login fails, try to register first, then login
          try {
            await axios.post(API_ENDPOINTS.REGISTER, {
              email: 'test@aurapply.com',
              password: 'test123',
              name: 'Test User'
            }, { timeout: 5000 });
            
            // Now login
            const loginResponse = await axios.post(API_ENDPOINTS.LOGIN, {
              email: 'test@aurapply.com',
              password: 'test123'
            }, { timeout: 5000 });
            
            if (loginResponse.data && loginResponse.data.token) {
              setToken(loginResponse.data.token);
              if (location.pathname === '/' || location.pathname === '/auth') {
                navigate('/dashboard', { replace: true });
              }
            }
          } catch (regError) {
            // If both fail, just continue - backend may not be ready yet
            console.log('Auto-login will retry when backend is ready');
          }
        }
      };
      
      // Delay to let backend start
      setTimeout(autoLogin, 2000);
    }
  }, [token, location.pathname, setToken, navigate]);

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
    <ThemeProvider>
      <AuthContext.Provider value={{ token, setToken: setTokenWithSync }}>
        <Router>
          <div className="min-h-screen font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300" style={{ minHeight: '100vh' }}>
            <AppContent />
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
