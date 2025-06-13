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

const BatchUpdate = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState({
    Bcode: "",
    description: "",
    Program_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [program, setProgram] = useState([]);
  const [selectedprogram, setSelectedProgram] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/auth/batch/${id}`)
      .then((result) => {
        if (result.data) {
          setBatch({
            ...result.data,
          });
          setSelectedProgram(result.data.Program_id); // Set selected program from batch data
        } else {
          setErrorMsg("Error fetching Batch Record");
        }
      })
      .catch(() => setErrorMsg("Error fetching Batch Record"));
  }, [id]);

  useEffect(() => {
    api.get(`/auth/programs`)
      .then((result) => {
        if (result.data.programs) {
          setProgram(result.data.programs);
        } else {
          alert(result.data.error || "Error fetching data");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Program_id") {
      setSelectedProgram(value);
      setBatch((prev) => ({ ...prev, Program_id: value }));
    } else {
      setBatch((prev) => ({
        ...prev,
        [name]: name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put(`/auth/batch/${id}`, batch)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Batch Record Updated Successfully");
          setTimeout(() => {
            navigate("/dashboard/batch");
          }, 1500);
        } else {
          setErrorMsg(result.data.Error);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Error updating Batch Record");
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/batch");
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
              Edit Batch Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Batch Details below:
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
                value={batch.Bcode}
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
                value={batch.description}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Program_id">Program</InputLabel>
                <Select
                  labelId="Program_id"
                  id="Program_id"
                  name="Program_id"
                  value={selectedprogram}
                  label="Program"
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
                  {program.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.code} - {program.Sname}
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

export default BatchUpdate;
