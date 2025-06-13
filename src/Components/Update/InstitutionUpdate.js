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

const defaultTheme = createTheme({});

const InstitutionUpdate = () => {

    const { id } = useParams();
    const[institution, setinstitution] = useState({
        code: "",
        name: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/auth/institution/${id}`)
        .then((result) => {
            if (result.data){
                setinstitution({
                    ...result.data,
                });
            } else {
                setErrorMsg("Error fetching institution Record");
            }
        })
        .catch((err) => setErrorMsg("Error fetching institution Record"));
    }, [id]);

    const formatDate = (dateString) => {
      if (!dateString) return ""; // Return an empty string if no date is provided
      const date = new Date(dateString);
      return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
    };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setinstitution((prev) => ({
          ...prev,
          [name]:
            name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        api
        .put(`/auth/institution/${id}`, institution)
        .then((result) => {
            if (result.data) {
                setSuccessMsg("institution Record Updated Successfully");
                setTimeout(() => {
                    navigate("/dashboard/institution");
                }, 1500)
            } else {
                setErrorMsg(result.data.Error);
            }
            setLoading(false);
        })
        .catch((err) => {
            setErrorMsg("Error updating institution Record");
            setLoading(false);
            });
      };

      const handleCancel = () => {
        navigate("/dashboard/institution"); 
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
              Edit institution Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter institution Details below:
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
                value={institution.code}
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
                value={institution.name}
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
}

export default InstitutionUpdate