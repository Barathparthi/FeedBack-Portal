import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await api.post(`/auth/reset-password`, { token, newPassword });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/adminlogin"); // Redirect to login after password is reset
      }, 5000); // Optional: wait 5 seconds before redirecting
    } catch (error) {
      setMessage("Error resetting password or Token Expired");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: "30px", maxWidth: "500px", width: "100%" }}>
          <Typography variant="h4" align="center">Reset Password</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
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

export default ResetPassword;
