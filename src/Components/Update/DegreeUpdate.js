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

const defaultTheme = createTheme();

const DegreeUpdate = () => {
  const { id } = useParams();
  const [degree, setDegree] = useState({
    code: "",
    name: "",
    description: "",
    institution_id: "", // Initialize institution_id
  });
  const [institutions, setInstitutions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/degree/${id}`)
      .then((result) => {
        if (result.data) {
          setDegree({
            ...result.data,
            // StartDate: formatDate(result.data.StartDate),
            // EndDate: formatDate(result.data.EndDate),
            institution_id: result.data.Institution_id, // Set institution_id
          });
        } else {
          setErrorMsg("Error fetching degree record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching degree record."));
  }, [id]);

  useEffect(() => {
    api
      .get(`/auth/institution`)
      .then((result) => {
        if (result.data.institutions) {
          setInstitutions(result.data.institutions);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toISOString().split("T")[0];
  // };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDegree((prev) => ({
      ...prev,
      [name]: name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/degree/${id}`, degree)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Degree entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/degree");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating degree record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/degree");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
        <Grid item md={6} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" align="center">Edit Degree Entry</Typography>
            <Typography variant="h6" color="text.primary" align="center">Please Enter Degree Details below:</Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Code"
                name="code"
                value={degree.code}
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
                value={degree.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={degree.description}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="institution_id">Institution</InputLabel>
                <Select
                  labelId="institution_id"
                  id="institution_id"
                  name="institution_id"
                  value={degree.institution_id} // Correctly bind the value
                  label="Institution"
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
                  {institutions.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <TextField
                margin="normal"
                required
                fullWidth
                id="startdate"
                label="Starting Date"
                type="date"
                name="StartDate"
                value={degree.StartDate}
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
                value={degree.EndDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 2 }}>
                <Button type="submit" variant="contained" disabled={loader}>
                  {loader ? <CircularProgress size={24} color="inherit" /> : "Update"}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancel} disabled={loader}>
                  {loader ? <CircularProgress size={24} color="inherit" /> : "Cancel"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DegreeUpdate;
