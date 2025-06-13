import { React, useState, useEffect } from "react";
import bgpic from "../../assets/Sriher_logo.jpg";
import axios from "axios";
import {
  Alert,
  Grid,
  Box,
  Autocomplete,
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
import Batch from "./Batch";
import api from "../axiosInstance";
// import "../styles/AdminRegister.css";

const defaultTheme = createTheme();

const Student = () => {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [dateofjoin, setDateofJoin] = useState(null);
  const [dateofend, setDateofEnd] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [program, setProgram] = useState([]);
  const [selectedprogram, setSelectedProgram] = useState("");

  const [Status, setStatus] = useState([]);
  const [selectedstatus, setSelectedStatus] = useState("");

  const [Department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [year, setYear] = useState([]);
  const [selectedyear, setSelectedYear] = useState("");

  const [Batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [Term, setTerm] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");

  const [Sem, setSem] = useState([]);
  const [selectedSem, setSelectedSem] = useState("");

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setErrorMsg('Invalid email format');
      return;
    }
  
    const formData = {
      uid: event.target.uid.value,
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      email: email,
      // p_email: event.target.p_email.value,
      Program_ID: selectedprogram,
      Batch_ID: selectedBatch,
      // Department_ID: selectedDepartment,
      Year_ID: selectedyear,
      Sem_ID: selectedSem,
      Term_ID: selectedTerm,
      Status_ID: selectedstatus,
      dateofjoin: dateofjoin,
      dateofend: dateofend
    };
    try {
      const response = await api.post(`/auth/student`, formData);
      console.log('Form data submitted successfully:', response.data);
      setSuccessMsg('Student registered successfully!');
        setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg('Duplicate entry: the provided code or name already exists.');
      } else {
        setErrorMsg('Failed to register Student. Please try again!');
      }
      setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/student"); 
  };

  useEffect(() => {
      // Fetch Status options
      api.get(`/auth/status`)
      .then((result) => setStatus(result.data.statuses || []))
      .catch(() => setErrorMsg("Error fetching Status options"));

            // Fetch Program options
            api.get(`/auth/program`)
            .then((result) => setProgram(result.data.programs || []))
            .catch(() => setErrorMsg("Error fetching Status options"));

            // Fetch Sem options
            api.get(`/auth/semester`)
            .then((result) => setSem(result.data.semesters || []))
            .catch(() => setErrorMsg("Error fetching Status options"));

                  // Fetch Term options
      api.get(`/auth/term`)
      .then((result) => setTerm(result.data.terms || []))
      .catch(() => setErrorMsg("Error fetching Status options"));

                        // Fetch Year options
                        api.get(`/auth/year`)
                        .then((result) => setYear(result.data.years || []))
                        .catch(() => setErrorMsg("Error fetching Status options"));
// Department Id Fetch
api.get(`/auth/department`)
.then((result) => {
  if (result.data) {
    setDepartment(result.data);
  } else {
    alert(result.data.Error);
  }
})
.catch((err) => console.log(err));

// Batch Id Fetch
api.get(`/auth/batches`)
.then((result) => {
  if (result.data) {
    setBatch(result.data);
  } else {
    alert(result.data.Error);
  }
})
.catch((err) => console.log(err));
      }, []);


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
              sx={{ my: 0, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Student Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Student Details in the below Textfield!...
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
                                                              <Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="uid"
                  label="Unique ID:"
                  name="uid"
                  autoComplete="name"
                  autoFocus
                />
                </Grid>
<Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="FirstName:"
                  name="firstname"
                  autoComplete="off"
                />
                </Grid>
<Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="LastName:"
                  name="lastname"
                  autoComplete="off"
                />
                </Grid>
<Grid item xs={4}>
<TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email:"
                  name="email"
                  // type="email"
                  autoComplete="off"
                />
                </Grid>
{/* <Grid item xs={4}>
<TextField
                  margin="normal"
                  required
                  fullWidth
                  id="p_email"
                  label="Parent Email:"
                  name="p_email"
                  // type="email"
                  autoComplete="off"
                />
                </Grid> */}
<Grid item xs={4}>
<FormControl fullWidth margin="normal" required>
                  <InputLabel id="Program_id">Program</InputLabel>
                  <Select
                    labelId="Program_id"
                    id="Program_id"
                    value={selectedprogram}
                    label="Program"
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {program.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.code} - {program.Sname}     
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
  <Autocomplete
    id="Batch_id"
    options={Batch}
    getOptionLabel={(option) => option.Bcode}
    value={selectedBatch ? Batch.find((batch) => batch.id === selectedBatch) : null}
    onChange={(event, newValue) => {
      setSelectedBatch(newValue ? newValue.id : "");
    }}
    renderInput={(params) => (
      <TextField {...params} label="Batch ID" variant="outlined" required />
    )}
    isOptionEqualToValue={(option, value) => option.id === value}
  />
</FormControl>
</Grid>
{/* <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Department_ID">Department_ID</InputLabel>
                  <Select
                    labelId="Department_ID"
                    id="Department_ID"
                    value={selectedDepartment}
                    label="Department_ID"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {Department.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.description}
                        {/* Adjust property names based on your data structure 
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid> */}
                <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Year_ID">Year_ID</InputLabel>
                  <Select
                    labelId="Year_ID"
                    id="Year_ID"
                    value={selectedyear}
                    label="Year_ID"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {year.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.code} - {i.description}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Sem_ID">Sem_ID</InputLabel>
                  <Select
                    labelId="Sem_ID"
                    id="Sem_ID"
                    value={selectedSem}
                    label="Sem_ID"
                    onChange={(e) => setSelectedSem(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {Sem.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.code} - {i.description}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Term_ID">Term_ID</InputLabel>
                  <Select
                    labelId="Term_ID"
                    id="Term_ID"
                    value={selectedTerm}
                    label="Term_ID"
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {Term.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.name}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Status_ID">Status_ID</InputLabel>
                  <Select
                    labelId="Status_ID"
                    id="Status_ID"
                    value={selectedstatus}
                    label="Status_ID"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, // Adjust height as needed
                        },
                      },
                    }}
                  >
                    {Status.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.name}
                        {/* Adjust property names based on your data structure */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="dateofjoin"
                  label="Date of Joining:"
                  type="date"
                  value={dateofjoin}
                  onChange={(e) => setDateofJoin(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </Grid>
<Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="dateofend"
                  label="Date of Ending (Optional):"
                  type="date"
                  value={dateofend}
                  onChange={(e) => setDateofEnd(e.target.value)}
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

export default Student;
