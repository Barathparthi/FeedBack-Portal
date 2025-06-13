import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ['/', '/adminlogin', '/forgot-password', '/reset-password', '/unauthorized'];

  useEffect(() => {
    if (publicRoutes.includes(location.pathname)) {
      console.log(`AuthContext: On public route (${location.pathname}), skipping token validation`);
      setIsAuthenticated(false);
      setRoleId(null);
      setLoading(false);
      return;
    }

    console.log('AuthContext: useEffect triggered');

    // Validate token via cookie
    api
      .get('/auth/validate-token', { withCredentials: true })
      .then((response) => {
        console.log('AuthContext: Token validation response:', response.data);
        if (response.data.valid) {
          // Fetch user details
          api
            .get('/auth/user', { withCredentials: true })
            .then((userResponse) => {
              const { roleId, loginId, loginTimestamp } = userResponse.data;
              setRoleId(String(roleId));
              sessionStorage.setItem('roleId', String(roleId)); // Store in sessionStorage for client-side use
              sessionStorage.setItem('loginId', loginId);
              sessionStorage.setItem('loginTimestamp', loginTimestamp);
              setIsAuthenticated(true);
              console.log(`AuthContext: Initialized with roleId: ${roleId}`);
            })
            .catch((error) => {
              console.error('AuthContext: User details fetch error:', error);
              setIsAuthenticated(false);
              setRoleId(null);
              navigate('/adminlogin?sessionExpired=true', { replace: true });
            })
            .finally(() => setLoading(false));
        } else {
          console.log('AuthContext: Token invalid, redirecting to login');
          setIsAuthenticated(false);
          setRoleId(null);
          sessionStorage.clear();
          navigate('/adminlogin?sessionExpired=true', { replace: true });
        }
      })
      .catch((error) => {
        console.error('AuthContext: Token validation error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('AuthContext: Token expired or unauthorized');
          sessionStorage.clear();
          navigate('/adminlogin?sessionExpired=true', { replace: true });
        }
        setIsAuthenticated(false);
        setRoleId(null);
        setLoading(false);
      });
  }, [navigate, location.pathname]);

  const login = (role, token) => {
    // Token is managed via cookie, so only store roleId in sessionStorage
    sessionStorage.setItem('roleId', String(role));
    setRoleId(String(role));
    setIsAuthenticated(true);
    setLoading(false);
    console.log(`AuthContext: Logged in with roleId: ${role}`);
  };

  const logout = () => {
    sessionStorage.clear();
    setRoleId(null);
    setIsAuthenticated(false);
    setLoading(false);
    console.log('AuthContext: Logged out');
    api.post('/auth/logout', {}, { withCredentials: true }); // Clear cookie on server
    navigate('/adminlogin', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roleId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};