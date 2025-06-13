import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';

const disableDebugging = (navigate, handleLogout) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && e.key === 'u') ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
      (e.ctrlKey && e.key === 's') ||
      e.key === 'F12' ||
      (e.metaKey && e.altKey && e.key === 'I') ||
      (e.metaKey && e.altKey && e.key === 'J') ||
      (e.metaKey && e.altKey && e.key === 'C')
    ) {
      e.preventDefault();
    }
  };

  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      handleLogout();
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', detectDevTools);
  const devToolsCheckInterval = setInterval(detectDevTools, 1000);

  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', detectDevTools);
    clearInterval(devToolsCheckInterval);
  };
};

const Role9Wrapper = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    api
      .get('/logout')
      .then((result) => {
        if (result.data.Status) {
          sessionStorage.removeItem('valid');
          sessionStorage.removeItem('loginId');
          sessionStorage.removeItem('roleId');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('loginTimestamp');
          navigate('/', { replace: true });
        }
      })
      .catch((err) => console.log('Logout error:', err));
  }, [navigate]);

  useEffect(() => {
    const cleanup = disableDebugging(navigate, handleLogout);
    return cleanup;
  }, [navigate, handleLogout]);

  return <>{children}</>;
};

export default Role9Wrapper;