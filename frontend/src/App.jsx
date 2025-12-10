import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import CoachDashboard from './components/Dashboard/CoachDashboard';
import PlayerDashboard from './components/Dashboard/PlayerDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentView('dashboard');
      } catch (error) {
        // Invalid saved user data, clear it
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const switchToLanding = () => {
    setCurrentView('landing');
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate view based on current state
  switch (currentView) {
    case 'login':
      return (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
          onBackToLanding={switchToLanding}
        />
      );
    
    case 'register':
      return (
        <Register
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
          onBackToLanding={switchToLanding}
        />
      );
    
    case 'dashboard':
      if (user?.role === 'super_admin') {
        return (
          <SuperAdminDashboard
            user={user}
            onLogout={handleLogout}
          />
        );
      } else if (user?.role === 'coach') {
        return (
          <CoachDashboard
            user={user}
            onLogout={handleLogout}
          />
        );
      } else if (user?.role === 'player') {
        return (
          <PlayerDashboard
            user={user}
            onLogout={handleLogout}
          />
        );
      }
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p>Unknown user role</p>
        </div>
      );
    
    case 'landing':
    default:
      return (
        <LandingPage
          onSwitchToLogin={switchToLogin}
          onSwitchToRegister={switchToRegister}
        />
      );
  }
}

export default App;
