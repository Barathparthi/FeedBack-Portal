import { React, useState, useEffect } from "react";
import bgpic from "../../assets/Sriher_logo.jpg";
import axios from "axios";
import {
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,FormControl, InputLabel, Select, MenuItem,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import { BrowserRouter as Router, Link, useNavigate, Navigate } from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Status = () => {

  const Navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [Lov, setLov] = useState([]);
  const [selectedLov, setSelectedLov] = useState("");

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      code: event.target.code.value,
      name: event.target.name.value,
      lov_id: selectedLov
    };
  
    try {
      const response = await api.post(`/auth/status`, formData);
      console.log('Form data submitted successfully:', response.data);
      setSuccessMsg('Status registered successfully!');
      setTimeout(() => {
        Navigate("/dashboard/lov");
      }, 1500);

        // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Status. Please try again!');
      }
      setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchLov = async () => {
      try {
        const response = await api.get(
          `/auth/lov`
        );
        setLov(response.data);
      } catch (error) {
        console.error("Failed to fetch descriptions", error);
      }
    };
    fetchLov();
  }, []);

  const handleCancel = (() => {
    Navigate('/dashboard/lov')
  })



  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "80vh",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item md={4} component={Paper} elevation={6} square>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 4, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Lov Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Lov Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Code"
                  name="code"
                  autoComplete="name"
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name:"
                  name="name"
                  autoComplete="off"
                />

<FormControl fullWidth margin="normal" required>
                  <InputLabel id="Lov_ID">Lov_ID</InputLabel>
                  <Select
                    labelId="Lov_ID"
                    id="Lov_ID"
                    value={selectedLov}
                    label="Lov_ID"
                    onChange={(e) => setSelectedLov(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {Lov.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.Description}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Button type="submit" variant="contained" disabled={loader}>
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Register"
                    )}
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                    disabled={loader}
                  >
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Status;
