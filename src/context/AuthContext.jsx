import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock checking session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = localStorage.getItem('saas_auth_session');
        if (storedSession) {
          setUser(JSON.parse(storedSession));
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate slight network delay for premium feel
    setTimeout(checkSession, 800);
  }, []);

  const login = async (email) => {
    // Mock login
    const mockUser = { id: '1', email, name: 'Alex Doe' };
    localStorage.setItem('saas_auth_session', JSON.stringify(mockUser));
    setUser(mockUser);
    return { error: null };
  };

  const logout = async () => {
    localStorage.removeItem('saas_auth_session');
    setUser(null);
  };

  const register = async (email, password, name) => {
    // Mock register
    const mockUser = { id: '1', email, name };
    localStorage.setItem('saas_auth_session', JSON.stringify(mockUser));
    setUser(mockUser);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
