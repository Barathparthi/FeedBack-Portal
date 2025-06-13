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

const RoleUpdate = () => {

    const { id } = useParams();
    const[role, setrole] = useState({
        Bcode: "",
        name: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/auth/role/${id}`)
        .then((result) => {
            if (result.data){
                setrole({
                    ...result.data,
                });
            } else {
                setErrorMsg("Error fetching role Record");
            }
        })
        .catch((err) => setErrorMsg("Error fetching role Record"));
    }, [id]);

    const formatDate = (dateString) => {
      if (!dateString) return ""; // Return an empty string if no date is provided
      const date = new Date(dateString);
      return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
    };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setrole((prev) => ({
          ...prev,
          [name]:
            name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        api
        .put(`/auth/role/${id}`, role)
        .then((result) => {
            if (result.data) {
                setSuccessMsg("role Record Updated Successfully");
                setTimeout(() => {
                    navigate("/dashboard/role");
                }, 1500)
            } else {
                setErrorMsg(result.data.Error);
            }
            setLoading(false);
        })
        .catch((err) => {
            setErrorMsg("Error updating role Record");
            setLoading(false);
            });
      };

      const handleCancel = () => {
        navigate("/dashboard/role"); 
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
              Edit role Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter role Details below:
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
                id="Bcode"
                label="Code"
                name="Bcode"
                value={role.code}
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
                value={role.name}
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

export default RoleUpdate