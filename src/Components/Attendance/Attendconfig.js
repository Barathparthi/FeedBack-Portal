import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from '../buttonStyles' 
import { Autocomplete } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";

const defaultTheme = createTheme();

const Attendconfig = () => {
  const [loader, setLoader] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");

  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [degrees, setDegrees] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");

  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState([]);

  const [Term, setTerm] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState([]);

  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [groupCode, setGroupCode] = useState("");
  const [selectedgroupCode, setselectedgroupCode] = useState("");

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message on form submission
    setSuccessMessage(""); // Reset success message on form submission

    const formData = {
      academicYear: selectedAcademicYear,
      program: selectedProgram,
      year: selectedYear,
      semester: selectedSemester,
      term: selectedTerm,
      course: selectedCourse.id,
      staff: selectedStaff.id,
      code: selectedgroupCode,
      description: description,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/group`,
        formData
      );
      console.log("Form data submitted successfully:", response.data);
      setSuccessMessage("Group created successfully."); // Set success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      console.error("Error submitting form data:", error);
      if (error.response.data.error.code === "ER_DUP_ENTRY") {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      } else {
        setErrorMessage(
          "Duplicate entry detected. Please try again with a different value."
        );
      }
    }
  };

  useEffect(() => {
    // Fetch Academic Years
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/academic`)
      .then((response) => {
        setAcademicYears(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Academic Years:", error);
      });

    // Fetch Degrees
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/degree`)
      .then((response) => {
        setDegrees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Degrees:", error);
      });

    // Fetch Term
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/term`)
      .then((response) => {
        setTerm(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Term:", error);
      });

    // Fetch Course
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/courses`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Course:", error);
      });

    // Fetch Staff
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/search/staff`)
      .then((response) => {
        setStaff(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
      });
  }, []);

  const fetchPrograms = (degreeId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/program/${degreeId}`)
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Programs:", error);
      });
  };

  const fetchYears = (degreeId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/year/${degreeId}`)
      .then((response) => {
        setYear(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Years:", error);
      });
  };

  const fetchSemesters = (yearId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/semester/${yearId}`)
      .then((response) => {
        setSemesters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Semesters:", error);
      });
  };

  const handleDegreeChange = (event) => {
    const selectedDegreeId = event.target.value;
    setSelectedDegree(selectedDegreeId);
    fetchYears(selectedDegreeId); // Fetch years for selected degree
    fetchPrograms(selectedDegreeId);
  };

  // Event handler for year dropdown change
  const handleYearChange = (event) => {
    const selectedYearId = event.target.value;
    setSelectedYear(selectedYearId);
    if (selectedYearId) {
      fetchSemesters(selectedYearId); // Fetch semesters for selected year
    }
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
        <Grid item md={4} component={Paper} elevation={6} square>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Attendance Configuration
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Configure Your Attendance Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="academic-year-label">
                        Academic Year
                      </InputLabel>
                      <Select
                        labelId="academic-year-label"
                        id="academic-year"
                        value={selectedAcademicYear}
                        label="Academic Year"
                        onChange={(e) =>
                          setSelectedAcademicYear(e.target.value)
                        }
                        fullWidth
                      >
                        {academicYears.map((academic) => (
                          <MenuItem key={academic.id} value={academic.id}>
                            {academic.name}
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
                      id="Code Name"
                      label="Code"
                      name="Code Name"
                      value={selectedgroupCode}
                      onChange={(e) => setselectedgroupCode(e.target.value)}
                      autoComplete="name"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="Name"
                      label="Name"
                      name="Name"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
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
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                  </Alert>
                )}
                {/* Display error message if it exists */}
                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}
              </Box>
            </Box>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Attendconfig;