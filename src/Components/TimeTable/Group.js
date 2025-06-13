import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Button,
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
import { LightPurpleButton } from "../buttonStyles";
import { Autocomplete } from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import api from "../axiosInstance";

const defaultTheme = createTheme();

const Group = () => {
  const Navigate = useNavigate();
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
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [groupCode, setGroupCode] = useState("");
  const [selectedgroupCode, setselectedgroupCode] = useState("");

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const [description, setDescription] = useState("");

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      academicYear: selectedAcademicYear,
      program: selectedProgram,
      year: selectedYear,
      semester: selectedSemester,
      term: selectedTerm,
      // course: selectedCourse.id,
      // staff: selectedStaff.id,
      code: selectedgroupCode,
      description: description,
    };

    try {
      const response = await api.post(
        `/auth4/group`,
        formData
      );
      console.log("Form data submitted successfully:", response.data);
      setSuccessMessage("Group created successfully."); // Set success message
      // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      setTimeout(() => {
        Navigate("/dashboard/group");
      }, 1500);
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      console.error("Error submitting form data:", error);
      if (error.response.data.error.code === "ER_DUP_ENTRY") {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
        setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      } else {
        setErrorMessage(
          "Duplicate entry detected. Please try again with a different value."
        );
        setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      }
    }
  };

  useEffect(() => {
    // Fetch Academic Years
    api
      .get(`/auth4/academic`)
      .then((response) => {
        setAcademicYears(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Academic Years:", error);
      });

    // Fetch Degrees
    api
      .get(`/auth4/degree`)
      .then((response) => {
        setDegrees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Degrees:", error);
      });

    // Fetch Term
    api
      .get(`/auth4/term`)
      .then((response) => {
        setTerm(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Term:", error);
      });

    // Fetch Course
    api
      .get(`/auth4/courses`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Course:", error);
      });

    // Fetch Staff
    api
      .get(`/auth4/search/staff`)
      .then((response) => {
        setStaff(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
      });
  }, []);

  const fetchPrograms = (degreeId) => {
    api
      .get(`/auth4/program/${degreeId}`)
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Programs:", error);
      });
  };

  const fetchYears = (degreeId) => {
    api
      .get(`/auth4/year/${degreeId}`)
      .then((response) => {
        setYear(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Years:", error);
      });
  };

  const fetchSemesters = (yearId) => {
    api
      .get(`/auth4/semester/${yearId}`)
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

  const handleCancel = () => {
    Navigate("/dashboard/group");
  };

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
                Group
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Group Details in the below Textfield!...
              </Typography>
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
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: "100%" }}
              >
                <Grid container justifyContent='center' alignItems='center' spacing={2}>
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="degree-label">Degree</InputLabel>
                      <Select
                        labelId="degree-label"
                        id="degree"
                        value={selectedDegree}
                        label="Degree"
                        onChange={handleDegreeChange}
                        fullWidth
                      >
                        {degrees.map((degree) => (
                          <MenuItem key={degree.id} value={degree.id}>
                            {degree.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="program-label">Program</InputLabel>
                      <Select
                        labelId="program-label"
                        id="program"
                        value={selectedProgram}
                        label="Program"
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        fullWidth
                      >
                        {programs.map((program) => (
                          <MenuItem key={program.id} value={program.id}>
                            {program.code} - {program.Sname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        id="year"
                        value={selectedYear}
                        label="Year"
                        onChange={handleYearChange}
                        fullWidth
                      >
                        {year.map((year) => (
                          <MenuItem key={year.id} value={year.id}>
                            {year.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="semester-label">Semester</InputLabel>
                      <Select
                        labelId="semester-label"
                        id="semester"
                        value={selectedSemester}
                        label="Semester"
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        fullWidth
                      >
                        {semesters.map((semester) => (
                          <MenuItem key={semester.id} value={semester.id}>
                            {semester.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="term-label">Term</InputLabel>
                      <Select
                        labelId="term-label"
                        id="term"
                        value={selectedTerm}
                        label="Term"
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        fullWidth
                      >
                        {Term.map((term) => (
                          <MenuItem key={term.id} value={term.id}>
                            {term.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <Autocomplete
                        id="course"
                        disablePortal
                        options={course}
                        getOptionLabel={(option) =>
                          `${option.code} - ${option.description}`
                        }
                        value={selectedCourse}
                        onChange={(event, newValue) => {
                          setSelectedCourse(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Course"
                            placeholder="Search course..."
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <Autocomplete
                        id="staff"
                        disablePortal
                        options={staff}
                        getOptionLabel={(option) =>
                          `${option.StaffCode} - ${option.FirstName}`
                        }
                        value={selectedStaff}
                        onChange={(event, newValue) => {
                          setSelectedStaff(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Staff"
                            placeholder="Search Staff..."
                          />
                        )}
                      />
                    </FormControl>
                  </Grid> */}

                  {/* <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <Autocomplete
                        id="staff"
                        disablePortal
                        options={staff}
                        getOptionLabel={(option) =>
                          `${option.StaffCode} - ${option.FirstName}`
                        }
                        value={selectedStaff}
                        onChange={(event, newValue) => {
                          setSelectedStaff(newValue);
                        }}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Avatar
                              src={option.avatarUrl}
                              alt={option.FirstName}
                            />
                            <div>
                              <span>{option.StaffCode}</span> -{" "}
                              {option.FirstName}
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Staff"
                            placeholder="Search Staff..."
                          />
                        )}
                      />
                    </FormControl> 
                  </Grid>*/}
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="groupcode"
                      label="Group Code"
                      name="groupcode"
                      value={selectedgroupCode}
                      onChange={(e) => setselectedgroupCode(e.target.value)}
                      autoComplete="name"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="description"
                      label="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoComplete="off"
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

export default Group;
