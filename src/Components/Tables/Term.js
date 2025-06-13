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

const Term = () => {

  const navigate = useNavigate();
  const [semtype, setSemType] = useState([]);
  const [selectedsemtype, setSelectedSemType] = useState("");
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
      name: event.target.name.value,
      semtype_ID: selectedsemtype
    };
  
    try {
      const response = await api.post(`/auth/term`, formData);
      console.log('Form data submitted successfully:', response.data);
      setSuccessMsg('Term registered successfully!');
        // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
        setTimeout(() => {
          navigate("/dashboard/term");
        }, 1500);
      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Term. Please try again!');
      }
      setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
// Semtype Id Fetch
      api.get(`/auth/semtype`)
      .then((result) => {
        if (result.data.semtypes) {
          setSemType(result.data.semtypes);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleCancel = (() => {
    navigate('/dashboard/term')
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
              sx={{ my: 6, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Term Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Term Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: "100%" }}
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
                  <InputLabel id="semtype_ID">SemType_ID</InputLabel>
                  <Select
                    labelId="semtype_ID"
                    id="semtype_ID"
                    value={selectedsemtype}
                    label="semtype_ID"
                    onChange={(e) => setSelectedSemType(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {semtype.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.name}
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

export default Term;
