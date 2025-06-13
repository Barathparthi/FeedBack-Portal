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
  MenuItem
} from "@mui/material";
import api from "../axiosInstance";

const defaultTheme = createTheme({});

const StatusUpdate = () => {
  const { id } = useParams();
  const [status, setStatus] = useState({
    code: "",
    name: "",
    lov_id: "", // use lowercase `lov_id` to match the field name
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [Lov, setLov] = useState([]);
  const [selectedLov, setSelectedLov] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/auth/status/${id}`)
      .then((result) => {
        if (result.data) {
          setStatus({
            ...result.data,
            lov_id: result.data.lov_Id
          });
        } else {
          setErrorMsg("Error fetching Status Record");
        }
      })
      .catch(() => setErrorMsg("Error fetching Status Record"));

          // Fetch Login options
    api.get(`/auth/lov`)
    .then((result) => setLov(result.data || []))
    .catch(() => setErrorMsg("Error fetching Login options"));
  }, [id]);


  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value, // This should update lov_id in the state
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put(`/auth/status/${id}`, status)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Status Record Updated Successfully");
          setTimeout(() => {
            navigate("/dashboard/lov");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Error updating Status Record");
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/lov");
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
              Edit Status Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Status Details below:
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
                label="Code"
                name="code"
                value={status.code}
                onChange={handleChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={status.name}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="lov_id">Lov_ID</InputLabel>
                <Select
                  labelId="lov_id"
                  id="lov_id"
                  name="lov_id"
                  value={status.lov_id}
                  label="Lov_ID"
                  onChange={handleChange}
                  fullWidth
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150, // Adjust height as needed
                      },
                    },
                  }}
                >
                  {Lov.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.Description}
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default StatusUpdate;
