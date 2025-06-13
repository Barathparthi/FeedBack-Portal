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
} from "@mui/material";
import api from "../axiosInstance";

const RegulationUpdate = () => {
  const { id } = useParams();
  const [regulation, setregulation] = useState({
    code: "",
    name: "",
    StartDate: "",
    EndDate: "",
  });
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/regulation/${id}`)
      .then((result) => {
        if (result.data) {
          setregulation({
            ...result.data,
            StartDate: formatDate(result.data.StartDate),
            EndDate: formatDate(result.data.EndDate),
          });
        } else {
          setErrorMsg("Error fetching regulation record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching regulation record."));
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setregulation((prev) => ({
      ...prev,
      [name]:
        name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/regulation/${id}`, regulation)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("regulation entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/regulation");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating regulation record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/regulation"); // Navigate to /dashboard/regulation
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
              Edit Regulation Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Regulation Details below:
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
                value={regulation.code}
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
                value={regulation.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="startdate"
                label="Starting Date"
                type="date"
                name="StartDate"
                value={regulation.StartDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="enddate"
                label="Ending Date"
                type="date"
                name="EndDate"
                value={regulation.EndDate}
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

export default RegulationUpdate;
