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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Year = () => {

  const Navigate = useNavigate();
  const [degree, setDegree] = useState([]);
  const [selecteddegree, setSelectedDegree] = useState("");
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      code: event.target.code.value,
      description: event.target.description.value,
      Degree_ID: selecteddegree
    };
  
    try {
      const response = await api.post(`/auth/year`, formData);
      console.log('Form data submitted successfully:', response.data);
      setSuccessMsg('Year registered successfully!');
        // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
        setTimeout(() => {
          Navigate("/dashboard/year");
        }, 1500);
      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Year. Please try again!');
      }
      setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    api
      .get(`/auth/degree`)
      .then((result) => {
        console.log(result.data); 
        if (result.data.degrees) {
          setDegree(result.data.degrees);  
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);
  
  const handleChange = (event) => {
    const selectedDegreeId = event.target.value;
    setSelectedDegree(selectedDegreeId);
  };
  
    const handleCancel = (() => {
      Navigate('/dashboard/year')
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
                Year Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Year Details in the below Textfield!...
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
                  id="description"
                  label="Description:"
                  name="description"
                  autoComplete="off"
                />

<FormControl fullWidth margin="normal" required>
                  <InputLabel id="Degree_id">Degree_ID</InputLabel>
                  <Select
                    labelId="Degree_id"
                    id="Degree_id"
                    value={selecteddegree}
                    label="Degree_ID"
                    onChange={handleChange}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {degree.map((degree) => (
                      <MenuItem key={degree.id} value={degree.id}>
                        {degree.code}  
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

export default Year;
