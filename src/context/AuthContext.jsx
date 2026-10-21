import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  quickDemoLogin,
  logoutUser,
  getStoredUser
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Check current session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn('No active session found.');
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
      setAuthModalOpen(false);
      showToast(`¡Bienvenido de vuelta, ${loggedUser.name}!`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      setUser(newUser);
      setAuthModalOpen(false);
      showToast(`¡Cuenta creada con éxito! Bienvenido, ${newUser.name}.`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const demoLogin = async () => {
    try {
      const demoUser = await quickDemoLogin();
      setUser(demoUser);
      setAuthModalOpen(false);
      showToast(`Conectado como usuario demo: ${demoUser.name}`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    showToast('Has cerrado sesión correctamente.');
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModalOpen,
        authModalMode,
        openAuth,
        closeAuth,
        login,
        register,
        demoLogin,
        logout,
        showToast
      }}
    >
      {children}
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-message toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
