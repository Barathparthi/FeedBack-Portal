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

const SemesterUpdate = () => {
  const { id } = useParams();
  const [semester, setSemester] = useState({
    code: "",
    description: "",
    year_id: "",
    semtype_id: ""
  });
  const [year, setYear] = useState([]);
  const [semtype, setSemType] = useState([]);
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/auth/semester/${id}`)
      .then((result) => {
        if (result.data) {
          setSemester({
            ...result.data,
            semtype_id: result.data.Semtype_id
          });
        } else {
          setErrorMsg("Error fetching semester record.");
        }
      })
      .catch((err) => setErrorMsg("Error fetching semester record."));

            // fetch semtype
            api.get(`/auth/semtype`)
            .then((result) => {
              if (result.data.semtypes) {
                setSemType(result.data.semtypes);
              } else {
                alert(result.data.error || "Error fetching data");
              }
            })
            .catch((err) => console.error("Error:", err));
      
                  // fetch year
                  api.get(`/auth/year`)
                  .then((result) => {
                    if (result.data.years) {
                      setYear(result.data.years);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSemester((prev) => ({
      ...prev,
      [name]:
        name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/semester/${id}`, semester)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Semester entry updated successfully!");
          setTimeout(() => {
            navigate("/dashboard/semester");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoader(false);
      })
      .catch((err) => {
        setErrorMsg("Error updating Semester record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/semester"); // Navigate to /dashboard/semester
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
              Edit Semester Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Semester Details below:
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
                value={semester.code}
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
                value={semester.description}
                onChange={handleChange}
              />
<FormControl fullWidth margin="normal" required>
                <InputLabel id="year_id">Year_ID</InputLabel>
                <Select
                  labelId="year_id"
                  id="year_id"
                  name="year_id"
                  value={semester.year_id} // Correctly bind the value
                  label="year"
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
                  {year.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="semtype_id">SemType_ID</InputLabel>
                <Select
                  labelId="semtype_id"
                  id="semtype_id"
                  name="semtype_id"
                  value={semester.semtype_id} // Correctly bind the value
                  label="semtype"
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
                  {semtype.map((semtype) => (
                    <MenuItem key={semtype.id} value={semtype.id}>
                      {semtype.code}
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

export default SemesterUpdate;
