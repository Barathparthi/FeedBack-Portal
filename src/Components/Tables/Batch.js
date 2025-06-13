import React, { useState, useEffect } from "react";
import bgpic from "../../assets/Sriher_logo.jpg";
import {
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import axios from "axios";
import api from "../axiosInstance";

const defaultTheme = createTheme();

const Batch = () => {
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [program, setProgram] = useState([]);
  const [selectedprogram, setSelectedProgram] = useState("");
  const navigate = useNavigate();

  const clearMessages = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    setErrorMsg(""); // Clear previous errors

    const formData = {
      Bcode: event.target.Bcode.value,
      description: event.target.description.value,
      Program_id: selectedprogram,
    };

    try {
      const response = await api.post(`/auth/batch`, formData);
      console.log("Form data submitted successfully:", response.data);
      setSuccessMsg("Batch registered successfully!");
      // setTimeout(clearMessages, 5000);  // Clear message after 10 seconds
      setTimeout(() => {
        navigate("/dashboard/batch");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form data:", error);
      if (error.response && error.response.status === 409) {
        setErrorMsg("Duplicate entry: The batch code already exists.");
      } else {
        setErrorMsg("Failed to register batch. Please try again!");
      }
      setTimeout(clearMessages, 5000); // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/batch");
  };

  const handleChange = (event) => {
    const selectedProgramId = event.target.value;
    setSelectedProgram(selectedProgramId);
  };

  useEffect(() => {
    // setIsLoading(true); // Uncomment if a loading state is needed
    api
      .get('/auth/programs') // Ensure the endpoint matches the backend route
      .then((response) => {
        // console.log(response.data.programs); // Check API response in the console
        if (response.data.programs) {
          setProgram(response.data.programs); // Set program data
        } else {
          alert(response.data.error || 'Error fetching programs');
        }
        // setIsLoading(false); // Uncomment to stop loading when the data is fetched
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error fetching data'); // Display a user-friendly message
        // setIsLoading(false); // Uncomment to stop loading on error
      });
  }, []);
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "80vh",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item md={4} component={Paper} elevation={6} sx={{ maxWidth: 600, padding: 3, margin: 'auto' }} rounded>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 4, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Batch
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Batch Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ width: '100%', maxWidth: 400, margin: 'auto' }}
              >
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Bcode"
                  label="Batch Code"
                  name="Bcode"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="Program_id">Program</InputLabel>
                  <Select
                    labelId="Program_id"
                    id="Program_id"
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
                  <Button type="submit" variant="contained" disabled={loader}>
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Register"
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
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Batch;
