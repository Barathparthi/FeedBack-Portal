import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from "@mui/material";
import api from "../axiosInstance";

const defaultTheme = createTheme();

const StaffUpdate = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState({
    StaffCode: "",
    FirstName: "",
    LastName: "",
    Status_ID: "",
    Department_ID: "",
    Role_ID: "",
    Login_ID: "",
    DateofJoin: "",
    DateofResign: ""
  });
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [Status, setStatus] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Role, setRole] = useState([]);
  const [Login, setLogin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch staff data
    api
      .get(`/auth/staff/${id}`)
      .then((result) => {
        if (result.data) {
          setStaff({
            ...result.data,
            DateofJoin: formatDate(result.data.DateofJoin),
            DateofResign: formatDate(result.data.DateofResign),
            Status_ID: result.data.Status_id,
            Department_ID: result.data.department_Id,
            Role_ID: result.data.role_Id,
            Login_ID: result.data.Login_id
          });
        } else {
          setErrorMsg("Error fetching Staff record.");
        }
      })
      .catch(() => setErrorMsg("Error fetching Staff record."));

    // Fetch Status options
    api.get(`/auth/status`)
      .then((result) => setStatus(result.data.statuses || []))
      .catch(() => setErrorMsg("Error fetching Status options"));

    // Fetch Role options
    api.get(`/auth/role`)
      .then((result) => setRole(result.data.roles || []))
      .catch(() => setErrorMsg("Error fetching Role options"));

    // Fetch Department options
    api.get(`/auth/department`)
      .then((result) => setDepartment(result.data || []))
      .catch(() => setErrorMsg("Error fetching Department options"));

    // Fetch Login options
    api.get(`/auth/login`)
      .then((result) => setLogin(result.data || []))
      .catch(() => setErrorMsg("Error fetching Login options"));
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({
      ...prev,
      [name]: name === "DateofJoin" || name === "DateofResign" ? formatDate(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    api
      .put(`/auth/staff/${id}`, staff)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Staff entry updated successfully!");
          setTimeout(() => navigate("/dashboard/staff"), 1500);
        } else {
          setErrorMsg(result.data.Error || "Error updating staff record.");
        }
        setLoader(false);
      })
      .catch(() => {
        setErrorMsg("Error updating staff record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/staff");
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
          <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" align="center">
              Edit Staff Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Staff Details below:
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
                id="StaffCode"
                label="Staff Code"
                name="StaffCode"
                value={staff.StaffCode}
                onChange={handleChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="FirstName"
                label="First Name"
                name="FirstName"
                value={staff.FirstName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="LastName"
                label="Last Name"
                name="LastName"
                value={staff.LastName}
                onChange={handleChange}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Status_ID">Status_ID</InputLabel>
                <Select
                  labelId="Status_ID"
                  id="Status_ID"
                  name="Status_ID"
                  value={staff.Status_ID}
                  label="Status ID"
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                >
                  {Status.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Department_ID">Department_ID (Optional)</InputLabel>
                <Select
                  labelId="Department_ID"
                  id="Department_ID"
                  name="Department_ID"
                  value={staff.Department_ID}
                  label="Department_ID (Optional)"
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                >
                  {Department.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Role_ID">Role ID (Optioal)</InputLabel>
                <Select
                  labelId="Role_ID"
                  id="Role_ID"
                  name="Role_ID"
                  value={staff.Role_ID}
                  label="Role_ID (Optional)"
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                >
                  {Role.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl fullWidth margin="normal" required>
  <Autocomplete
    id="Login_ID"
    options={Login}
    getOptionLabel={(option) => option.username}
    value={staff.Login_ID ? Login.find((i) => i.id === staff.Login_ID) : null}
    onChange={(event, newValue) => {
      handleChange({
        target: {
          name: "Login_ID",
          value: newValue ? newValue.id : "",
        },
      });
    }}
    renderInput={(params) => (
      <TextField {...params} label="Login ID" variant="outlined" required />
    )}
  />
</FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id="DateofJoin"
                label="Date of Join"
                type="date"
                name="DateofJoin"
                value={staff.DateofJoin}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="DateofResign"
                label="Date of Resign"
                type="date"
                name="DateofResign"
                value={staff.DateofResign}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                    "Update"
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
         </Grid>
       </Grid>
     </ThemeProvider>
  );
};

export default StaffUpdate;