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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../axiosInstance";

const LovCatergotyUpdate = () => {
  const { id } = useParams();
  const [lovcat, setLovcat] = useState({
    code: "",
    Description: ""
  });

  const [loader, setLoader] = useState(false);
  const [degree, setDegree] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/lovcat/${id}`)
      .then((result) => {
        if (result.data) {
            console.log(result.data)
          setLovcat({
            ...result.data,
          });
        } else {
          setErrorMsg("Error fetching Lovcat record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching Lovcat record."));           
  }, [id]);


  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLovcat((prevLovcat) => ({
        ...prevLovcat,
        [name]: value
    }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/lovcat/${id}`, lovcat)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Lovcat entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/lovcat");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating Lovcat record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/lovcat"); 
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
              Edit Lov Category Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Lov Category Details below:
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
                value={lovcat.code}
                onChange={handleChange}
                autoFocus
              />
            <TextField
                margin="normal"
                required
                fullWidth
                id="Description"
                label="Description"
                name="Description"
                value={lovcat.Description}
                onChange={handleChange}
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

export default LovCatergotyUpdate;
