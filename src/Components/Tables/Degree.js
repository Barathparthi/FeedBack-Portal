import { React, useState, useEffect } from "react";
import axios from 'axios';
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
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Degree = () => {

  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [institution, setInstitution] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const navigate = useNavigate();

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
      institution: selectedInstitution
    };

    try {
      const response = await api.post(`/auth/degree`, formData);
      if (response.status === 200) {
        console.log('Form data submitted successfully:', response.data);
        setSuccessMsg('Degree registered successfully!');
        // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
        setTimeout(() => {
          navigate("/dashboard/degree");
        }, 1500);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Degree. Please try again!');
      }
      setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

    useEffect(() => {
    api.get(`/auth/institution`)
      .then((result) => {
        if (result.data.institutions) {
          setInstitution(result.data.institutions);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleCancel = (() => {
    navigate('/dashboard/degree')
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
        <Grid item md={6} component={Paper} elevation={6} rounded>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 4, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Degree
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Degree Details in the below Textfield!...
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
                  <InputLabel id="Institution_ID">Institution</InputLabel>
                  <Select
                    labelId="Institution_ID"
                    id="Institution_ID"
                    value={selectedInstitution}
                    label="Institution"
                    onChange={(e) => setSelectedInstitution(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {institution.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.name}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                {/* <Grid item xs={6}>
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
                </Grid> */}
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

export default Degree;
