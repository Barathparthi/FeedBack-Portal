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

const AcademicUpdate = () => {
  const { id } = useParams();
  const [academic, setAcademic] = useState({
    code: "",
    name: "",
    description: "",
    StartDate: "",
    EndDate: "",
  });
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/academicyear/${id}`)
      .then((result) => {
        if (result.data) {
          setAcademic({
            ...result.data,
            StartDate: formatDate(result.data.StartDate),
            EndDate: formatDate(result.data.EndDate),
          });
        } else {
          setErrorMsg("Error fetching academic record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching academic record."));
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcademic((prev) => ({
      ...prev,
      [name]:
        name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/academicyear/${id}`, academic)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Academic entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/academic");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating academic record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/academic"); // Navigate to /dashboard/academic_year
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
              Edit Academic Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Academic Year Details below:
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2, width: "100%" }}
            >
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
              <Grid container justifyContent="center" alignItems="center" spacing={3}>
              <Grid item xs={3}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Code"
                name="code"
                value={academic.code}
                onChange={handleChange}
                autoFocus
              />
              </Grid>
              <Grid item xs={3}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={academic.name}
                onChange={handleChange}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={academic.description}
                onChange={handleChange}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="startdate"
                label="Starting Date"
                type="date"
                name="StartDate"
                value={academic.StartDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="enddate"
                label="Ending Date"
                type="date"
                name="EndDate"
                value={academic.EndDate}
                onChange={handleChange}
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

export default AcademicUpdate;