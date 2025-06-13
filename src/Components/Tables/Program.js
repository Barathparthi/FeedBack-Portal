import { React, useState, useEffect } from "react";
import axios from "axios";
import bgpic from "../../assets/Sriher_logo.jpg";
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
import { BrowserRouter as Router, Link, useNavigate, Navigate } from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Program = () => {
  
  const Navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [degree, setDegree] = useState([]);
  const [selecteddegree, setSelectedDegree] = useState("");

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    const formData = {
      code: event.target.code.value,
      name: event.target.name.value,
      description: event.target.description.value,
      degree_id: selecteddegree,
      startdate: startDate,
      enddate: endDate
    };

    try {
      const response = await api.post(`/auth/program`, formData);
      if (response.status === 200) {
        console.log('Form data submitted successfully:', response.data);
        setSuccessMsg('Program registered successfully!');
        // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
        setTimeout(() => {
          Navigate("/dashboard/program");
        }, 1500);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Program. Please try again!');
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
    Navigate('/dashboard/program')
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
        <Grid item md={6} component={Paper} elevation={6} square>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 4, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Program Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Program Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Grid container justifyContent='center' alignItems='center' spacing={2}>
                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name:"
                  name="name"
                  autoComplete="off"
                />
                </Grid>

<Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description:"
                  name="description"
                  autoComplete="off"
                />
                </Grid>

<Grid item xs={6}>
<FormControl fullWidth margin="normal" required>
                  <InputLabel id="Program_id">Degree</InputLabel>
                  <Select
                    labelId="Program_id"
                    id="Program_id"
                    value={selecteddegree}
                    label="Program"
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
                </Grid>

                <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startdate"
                  label="Starting Date:"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </Grid>

<Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="enddate"
                  label="Ending Date:"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </Grid>
                </Grid>

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

export default Program;
