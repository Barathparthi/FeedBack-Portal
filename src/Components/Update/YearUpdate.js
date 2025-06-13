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

const YearUpdate = () => {
  const { id } = useParams();
  const [year, setYear] = useState({
    code: "",
    description: "",
    degree_id: ""
  });

  const [loader, setLoader] = useState(false);
  const [degree, setDegree] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/year/${id}`)
      .then((result) => {
        if (result.data) {
          setYear({
            ...result.data,
            degree_id: result.data.Degree_id
          });
        } else {
          setErrorMsg("Error fetching year record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching year record."));

// Degree Fetch
      api.get(`/auth/degree`)
      .then((result) => {
        if (result.data.degrees) {
          setDegree(result.data.degrees);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));
                  
  }, [id]);


  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setYear((prevYear) => ({
        ...prevYear,
        [name]: value
    }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/year/${id}`, year)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Year entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/year");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating Year record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/year"); // Navigate to /dashboard/year
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
              Edit Year Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Year Details below:
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
                value={year.code}
                onChange={handleChange}
                autoFocus
              />
            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={year.description}
                onChange={handleChange}
              />
<FormControl fullWidth margin="normal" required>
                <InputLabel id="degree_id">Degree</InputLabel>
                <Select
                  labelId="degree_id"
                  id="degree_id"
                  name="degree_id"
                  value={year.degree_id} // Correctly bind the value
                  label="degree"
                  onChange={handleChange}
                  fullWidth
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                >
                  {degree.map((degree) => (
                    <MenuItem key={degree.id} value={degree.id}>
                      {degree.code}
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

export default YearUpdate;
