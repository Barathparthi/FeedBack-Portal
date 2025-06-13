import React, { useState } from "react";
// import bgpic from "../../assets/Sriher_logo.jpg";
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const defaultTheme = createTheme();

const Day = () => {
  // const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      code: event.target.code.value,
      name: event.target.name.value,
      description: event.target.description.value,
      startdate: startDate,
      enddate: endDate
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/academicyear`, formData);
      console.log('Form data submitted successfully:', response.data);
      // Optionally, reset form fields or show a success message
    } catch (error) {
      console.error('Error submitting form data:', error);}
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "100vh",
          // backgroundImage: url(${bgpic}),
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item md={4} component={Paper} elevation={6} square>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Day Config
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Day Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
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


                <LightPurpleButton
                  type="Submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </LightPurpleButton>
              </Box>
            </Box>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Day;