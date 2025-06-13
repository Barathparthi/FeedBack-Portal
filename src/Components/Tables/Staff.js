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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Button,
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

const Staff = () => {
  const Navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [dateofjoin, setDateofJoin] = useState(null);
  const [dateofresign, setDateofResign] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [Status, setStatus] = useState([]);
  const [selectedstatus, setSelectedStatus] = useState("");

  const [Department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [Role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [Login, setLogin] = useState([]);
  const [selectedLogin, setSelectedLogin] = useState("");

  const clearMessages = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      code: event.target.code.value,
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      Status_ID: selectedstatus,
      Department_ID: selectedDepartment,
      Role_ID: selectedRole,
      Login_ID: selectedLogin,
      dateofjoin: dateofjoin,
      dateofresign: dateofresign,
    };

    try {
      const response = await api.post(
        `/auth/staff`,
        formData
      );
      console.log("Form data submitted successfully:", response.data);
      setSuccessMsg("Staff registered successfully!");
      setTimeout(() => {
        Navigate("/dashboard/staff");
      }, 1500);

      // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      // Optionally, reset form fields or show a success message
      // navigate('/success'); // Redirect to success page
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg(
          "Duplicate entry: the provided code or name already exists."
        );
      } else {
        setErrorMsg("Failed to register Staff. Please try again!");
      }
      setTimeout(clearMessages, 5000); // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // Status Id Fetch
    api
      .get(`/auth/status`)
      .then((result) => {
        if (result.data.statuses) {
          setStatus(result.data.statuses);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));

    // Role Id Fetch
    api
      .get(`/auth/role`)
      .then((result) => {
        if (result.data.roles) {
          setRole(result.data.roles);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));

    // Department Id Fetch
    api
      .get(`/auth/department`)
      .then((result) => {
        if (result.data) {
          setDepartment(result.data);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Login ID Fetch
    api
      .get(`/auth/login`)
      .then((result) => {
        if (result.data) {
          setLogin(result.data);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCancel = () => {
    Navigate("/dashboard/staff");
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
                Staff Details
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Staff Details in the below Textfield!...
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
                  spacing={3}
                >
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="code"
                      label="Staff Code"
                      name="code"
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
                            {/* Adjust property names based on your data structure */}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="Role_ID">Role_ID (Optional)</InputLabel>
                      <Select
                        labelId="Role_ID"
                        id="Role_ID"
                        value={selectedRole}
                        label="Role_ID (Optional)"
                        onChange={(e) => setSelectedRole(e.target.value)}
                        fullWidth
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150, // Adjust height as needed
                            },
                          },
                        }}
                      >
                        {Role.map((i) => (
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
                      <Autocomplete
                        options={Login}
                        getOptionLabel={(option) => option.username || ""} // Set the label to display in options
                        onChange={(event, newValue) =>
                          setSelectedLogin(newValue ? newValue.id : null)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Login_ID (Optional)"
                            placeholder="Search for Login_ID (Optional)"
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                      />
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
                      id="dateofresign"
                      label="Date of Resignation (Optional):"
                      type="date"
                      value={dateofresign}
                      onChange={(e) => setDateofResign(e.target.value)}
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

export default Staff;
