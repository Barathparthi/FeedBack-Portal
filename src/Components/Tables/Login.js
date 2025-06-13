import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../style.css';
import api from '../axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Dash/AuthContext';

const Login = () => {
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Check for sessionExpired query parameter
  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();


    const handleSubmit = (event) => {
    event.preventDefault();
    setUsernameError(false);
    setPasswordError(false);
    setError('');

    if (!values.username.trim()) {
      setUsernameError(true);
      setError('Username is required');
      return;
    } else if (values.username.length < 3) {
      setUsernameError(true);
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!values.password.trim()) {
      setPasswordError(true);
      setError('Password is required');
      return;
    } else if (values.password.length < 6) {
      setPasswordError(true);
      setError('Password must be at least 6 characters long');
      return;
    }

    sessionStorage.clear(); // Clear any existing session data

    api
      .post('/auth/login', values, { withCredentials: true })
      .then((response) => {
        const { roleId, loginId, loginStatus, loginTimestamp } = response.data;
        console.log('Login: API response:', response.data);
        if (loginStatus) {
          sessionStorage.setItem('loginId', loginId);
          sessionStorage.setItem('loginTimestamp', loginTimestamp);
          login(roleId); // No token stored in sessionStorage
          console.log('Login: roleId stored, navigating to /dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          setError('Username or password is incorrect');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      });
  };

  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm1">
        <h2 style={{ textAlign: 'center' }}>Login Page</h2>
        {sessionExpired && (
          <Typography color="error" variant="subtitle1" style={{ textAlign: 'center', marginBottom: '16px' }}>
            Your session has expired. Please log in again.
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              type="text"
              name="username"
              autoComplete="username"
              label="Username"
              placeholder="Enter Username"
              onChange={(e) => setValues({ ...values, username: e.target.value })}
              error={usernameError}
              helperText={usernameError && 'Username incorrect'}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <TextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Enter Password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              error={passwordError}
              helperText={passwordError && 'Password incorrect'}
              className="form-control rounded-0"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button
            variant="contained"
            color="success"
            fullWidth
            className="rounded-5 mb-2"
            type="submit"
            style={{ marginBottom: '16px' }}
          >
            Log in
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/forgot-password')}
            style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '8px' }}
          >
            Forgot Password?
          </Button>
          {(error || usernameError || passwordError) && (
            <Typography color="error" variant="subtitle1" style={{ textAlign: 'center', display: 'block' }}>
              {error}
            </Typography>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;