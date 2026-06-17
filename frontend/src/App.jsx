import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ContractorDashboard from './pages/ContractorDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import PreCadastro from './pages/PreCadastro';
import { api } from './services/api';

function App() {
  const [page, setPage] = useState('landing'); // 'landing', 'login', 'contratante', 'prestador'
  const [params, setParams] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const stored = api.getStoredUser();
      const token = api.getToken();
      
      if (stored && token) {
        try {
          // Verify session is still valid with backend
          const me = await api.getMe();
          setCurrentUser(me);
          // Redirect directly to dashboard
          if (me.role === 'contratante') {
            setPage('contratante');
          } else {
            setPage('prestador');
          }
        } catch (err) {
          console.error("Session verification failed, logging out:", err);
          api.clearAuth();
          setCurrentUser(null);
          setPage('landing');
        }
      } else {
        setPage('landing');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const navigate = (nextPage, nextParams = {}) => {
    setParams(nextParams);
    
    // If navigating to a dashboard, ensure user is set
    if (nextPage === 'contratante' || nextPage === 'prestador') {
      const stored = api.getStoredUser();
      if (!stored) {
        setPage('login');
        return;
      }
      setCurrentUser(stored);
    }
    
    setPage(nextPage);
  };

  const handleLogout = () => {
    api.clearAuth();
    setCurrentUser(null);
    navigate('landing');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', gap: '16px' }}>
        <div className="sidebar-logo" style={{ animation: 'pulse-ring 1.5s infinite', width: '50px', height: '50px', fontSize: '1.8rem' }}>RO</div>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Carregando REDEOBRAS...</span>
      </div>
    );
  }

  return (
    <>
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'login' && <AuthPage onNavigate={navigate} params={params} />}
      {page === 'pre-cadastro' && <PreCadastro />}
      {page === 'contratante' && currentUser && (
        <ContractorDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {page === 'prestador' && currentUser && (
        <ProviderDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
