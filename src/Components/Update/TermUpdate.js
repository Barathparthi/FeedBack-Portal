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

const defaultTheme = createTheme({});

const TermUpdate = () => {

    const { id } = useParams();
    const[term, setTerm] = useState({
        code: "",
        name: "",
        semtype_id: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [semtype, setSemType] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/auth/term/${id}`)
        .then((result) => {
            if (result.data){
                setTerm({
                    ...result.data,
                    Semtype_id: result.data.semtype_id
                });
            } else {
                setErrorMsg("Error fetching term Record");
            }
        })
        .catch((err) => setErrorMsg("Error fetching term Record"));

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

    }, [id]);

    const formatDate = (dateString) => {
      if (!dateString) return ""; // Return an empty string if no date is provided
      const date = new Date(dateString);
      return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Return empty if date is invalid
    };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setTerm((prev) => ({
          ...prev,
          [name]:
            name === "StartDate" || name === "EndDate" ? formatDate(value) : value,
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        api
        .put(`/auth/term/${id}`, term)
        .then((result) => {
            if (result.data) {
                setSuccessMsg("Term Record Updated Successfully");
                setTimeout(() => {
                    navigate("/dashboard/term");
                }, 1500)
            } else {
                setErrorMsg(result.data.Error);
            }
            setLoading(false);
        })
        .catch((err) => {
            setErrorMsg("Error updating term Record");
            setLoading(false);
            });
      };

      const handleCancel = () => {
        navigate("/dashboard/term"); 
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
              Edit Term Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Term Details below:
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
                value={term.code}
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
                value={term.name}
                onChange={handleChange}
              />

<FormControl fullWidth margin="normal" required>
                <InputLabel id="semtype_id">SemType_ID</InputLabel>
                <Select
                  labelId="semtype_id"
                  id="semtype_id"
                  name="semtype_id"
                  value={term.semtype_id} // Correctly bind the value
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

export default TermUpdate