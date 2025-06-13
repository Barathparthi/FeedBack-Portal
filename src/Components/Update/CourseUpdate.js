import { React, useState, useEffect } from "react";
// import bgpic from "../../assets/Sriher_logo.jpg";
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
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import styled from "styled-components";
import { BrowserRouter as Router, Link, useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const CourseUpdate = () => {
    const { id } = useParams();
    const [course, setCourse] = useState({
        code: "",
        description: "",
        Lecture: "",
        Tutorial: "",
        Practical: "",
        Total: "",
        Hours: "",
        Regulation_id: ""
    });
    const [regulations, setRegulations] = useState([]);  // Separate state for regulations
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the specific course by ID
        api.get(`/auth/course/${id}`)
        .then((result) => {
            if (result.data){
                setCourse(result.data);
            } else {
                setErrorMsg("Error fetching Course Record");
            }
        })
        .catch((err) => setErrorMsg("Error fetching Course Record"));
        
        // Fetch all regulations for the dropdown
        api.get(`/auth/regulation1`)
        .then((result) => {
            if (result.data) {
                setRegulations(result.data);  // Set the regulations array
            } else {
                setErrorMsg("Error fetching Regulations");
            }
        })
        .catch((err) => setErrorMsg("Error fetching Regulations"));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        api
        .put(`/auth/course/${id}`, course)
        .then((result) => {
            if (result.data) {
                setSuccessMsg("Course Record Updated Successfully");
                setTimeout(() => {
                    navigate("/dashboard/course");
                }, 1500);
            } else {
                setErrorMsg(result.data.Error);
            }
            setLoading(false);
        })
        .catch((err) => {
            setErrorMsg("Error updating Course Record");
            setLoading(false);
            });
    };

    const handleCancel = () => {
        navigate("/dashboard/course"); 
    };

    return (
        <ThemeProvider theme={defaultTheme}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              height: "100vh",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Grid item md={6} component={Paper} elevation={6} square>
              <div className="d-flex justified-content-center align-items-center mt-3">
                <Box
                  sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}
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
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="code"
                      label="Course Code"
                      name="code"
                      value={course.code}
                      onChange={handleChange}
                      autoComplete="name"
                      autoFocus
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="description"
                      label="Description"
                      name="description"
                      value={course.description}
                      onChange={handleChange}
                      autoComplete="off"
                    />

<TextField
                      margin="normal"
                      required
                      fullWidth
                      id="lecture"
                      label="Lecture"
                      name="lecture"
                      value={course.Lecture}
                      onChange={handleChange}
                      autoComplete="off"
                    />

<TextField
                      margin="normal"
                      required
                      fullWidth
                      id="tutorial"
                      label="Tutorial"
                      name="tutorial"
                      value={course.Tutorial}
                      onChange={handleChange}
                      autoComplete="off"
                    />

<TextField
                      margin="normal"
                      required
                      fullWidth
                      id="practical"
                      label="Practical"
                      name="practical"
                      value={course.Practical}
                      onChange={handleChange}
                      autoComplete="off"
                    />

<TextField
                      margin="normal"
                      required
                      fullWidth
                      id="total"
                      label="Total"
                      name="total"
                      value={course.Total}
                      onChange={handleChange}
                      autoComplete="off"
                    />

<TextField
                      margin="normal"
                      required
                      fullWidth
                      id="hours"
                      label="Hours"
                      name="hours"
                      value={course.Hours}
                      onChange={handleChange}
                      autoComplete="off"
                    />

                    {/* Render regulations dropdown */}
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="regulation-label">Regulation</InputLabel>
                      <Select
                        labelId="regulation-label"
                        id="Regulation_id"
                        name="Regulation_id"
                        value={course.Regulation_id}
                        onChange={handleChange}
                        fullWidth
                      >
                        {regulations.map((regulation) => (
                          <MenuItem key={regulation.id} value={regulation.id}>
                            {regulation.name}
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
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update"
                  )}
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {loading ? (
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

export default CourseUpdate;
