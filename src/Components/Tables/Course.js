import { React, useState, useEffect } from "react";
import bgpic from "../../assets/Sriher_logo.jpg";
import axios from "axios";
import {
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Course = () => {
  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const Navigate = useNavigate();

  const clearMessages = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      code: event.target.code.value,
      description: event.target.description.value,
      lecture: event.target.lecture.value,
      tutorial: event.target.tutorial.value,
      practical: event.target.practical.value,
      total: event.target.total.value,
      hours: event.target.hours.value,
      Regulation: selectedCourse,
    };

    try {
      const response = await api.post(`/auth/course`, formData);
      console.log("Form data submitted successfully:", response.data);
      setSuccessMsg("Course registered successfully!");
      // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      setTimeout(() => {
        Navigate("/dashboard/course");
      }, 1500);

      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg(
          "Duplicate entry: the provided code or name already exists."
        );
      } else {
        setErrorMsg("Failed to register academic year. Please try again!");
      }
      setTimeout(clearMessages, 5000); // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/auth/regulation1`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch descriptions", error);
      }
    };
    fetchCourse();
  }, []);

  const handleCancel = () => {
    Navigate("/dashboard/course");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "85vh",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item md={5} component={Paper} elevation={6} rounded>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 2, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Course
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Course Details in the below Textfield!...
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="code"
                      label="Course Code"
                      name="code"
                      autoComplete="name"
                      autoFocus
                    />
                  </Grid>

                  {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Sname"
                  label="Sname:"
                  name="Sname"
                  autoComplete="off"
                /> */}
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
                    <TextField
                      margin="normal"
                      required
                      type="number"
                      fullWidth
                      id="lecture"
                      label="Lecture:"
                      name="lecture"
                      autoComplete="off"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      type="number"
                      fullWidth
                      id="tutorial"
                      label="Tutorial:"
                      name="tutorial"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      type="number"
                      fullWidth
                      id="practical"
                      label="Practical:"
                      name="practical"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      type="number"
                      fullWidth
                      id="total"
                      label="Total:"
                      name="total"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      type="number"
                      fullWidth
                      id="hours"
                      label="Hours:"
                      name="hours"
                      autoComplete="off"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="description-label">
                        Regulation_ID
                      </InputLabel>
                      <Select
                        labelId="description-label"
                        id="description"
                        value={selectedCourse}
                        label="Description"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        fullWidth
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150, // Adjust height as needed
                            },
                          },
                        }}
                      >
                        {course.map((description) => (
                          <MenuItem key={description.id} value={description.id}>
                            {description.name}
                            {/* Adjust property names based on your data structure */}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

export default Course;
