import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Paper, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#3f51b5",
      marginBottom: "20px",
    },
    body1: {
      color: "#d32f2f",
    },
  },
});

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message === "Password reset link sent to your email.") {
      const timer = setTimeout(() => {
        navigate("/adminlogin");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(`/auth/forgot-password`, { username });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error sending password reset link.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: "30px", maxWidth: "500px", width: "100%" }}>
          <Typography variant="h4" align="center">Forgot Password</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send Reset Link
            </Button>
          </form>
          {message && (
            <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPassword;
