import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import api from "../axiosInstance"; // Ensure your axios instance is properly configured

const defaultTheme = createTheme();

const StudentUpdate = () => {
  const { id } = useParams();
  const [student, setStudent] = useState({
    uid: "",
    FirstName: "",
    LastName: "",
    email: "",
    Program_id: "",
    Batch_id: "",
    Year_id: "",
    Sem_id: "",
    term_id: "",
    Status_ID: "",
    DateofJoin: "",
    DateofEnd: "",
  });
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [years, setYears] = useState([]);
  const [sems, setSems] = useState([]);
  const [terms, setTerms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data
    api
      .get(`/auth/student/${id}`)
      .then((result) => {
        if (result.data) {
            console.log(result.data.Batch_id);
          setStudent({
            ...result.data,
            DateofJoin: formatDate(result.data.DateofJoin),
            DateofEnd: formatDate(result.data.DateofEnd),
            Status_ID: result.data.Status_id,
            Program_id: result.data.Program_id,
            Batch_id: result.data.Batch_id,
            Year_id: result.data.Year_id,
            Sem_id: result.data.Sem_id,
            term_id: result.data.term_id,

          });
        } else {
          setErrorMsg("Error fetching student record.");
        }
      })
      .catch(() => setErrorMsg("Error fetching student record."));

    // Fetch dropdown options
    api
      .get(`/auth/statuses`)
      .then((result) => setStatusList(result.data || []))
      .catch(() => setErrorMsg("Error fetching status options"));
    api
      .get(`/auth/programs`)
      .then((result) => setPrograms(result.data.programs || []))
      .catch(() => setErrorMsg("Error fetching program options"));
    api
      .get(`/auth/batches`)
      .then((result) => setBatches(result.data || []))
      .catch(() => setErrorMsg("Error fetching batch options"));
    api
      .get(`/auth/year`)
      .then((result) => setYears(result.data.years || []))
      .catch(() => setErrorMsg("Error fetching year options"));
    api
      .get(`/auth/semesters`)
      .then((result) => setSems(result.data || []))
      .catch(() => setErrorMsg("Error fetching semester options"));
    api
      .get(`/auth/term`)
      .then((result) => setTerms(result.data.terms || []))
      .catch(() => setErrorMsg("Error fetching term options"));
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    api
      .put(`/auth/student/${id}`, student)
      .then((result) => {
        if (result.data) {
          setSuccessMsg("Student entry updated successfully!");
          setTimeout(() => navigate("/dashboard/student"), 1500);
        } else {
          setErrorMsg(result.data.Error || "Error updating student record.");
        }
        setLoader(false);
      })
      .catch(() => {
        setErrorMsg("Error updating student record.");
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/student");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
        <Grid item md={6} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" align="center">
              Edit Student Entry
            </Typography>
            <Typography variant="h6" color="text.primary" align="center">
              Please Enter Student Details below:
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

              <TextField
                margin="normal"
                required
                fullWidth
                id="uid"
                label="Unique ID"
                name="uid"
                value={student.uid}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="FirstName"
                label="First Name"
                name="FirstName"
                value={student.FirstName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="LastName"
                label="Last Name"
                name="LastName"
                value={student.LastName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={student.email}
                onChange={handleChange}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Program_id-label">Program</InputLabel>
                <Select
                  labelId="Program_id-label"
                  id="Program_id"
                  name="Program_id"
                  value={student.Program_id}
                  label="Program"
                  onChange={handleChange}
                >
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.code} - {program.Sname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Batch_id">Batch</InputLabel>
                <Select
                  labelId="Batch_id"
                  id="Batch_id"
                  name="Batch_id"
                  value={student.Batch_id}
                  label="Batch"
                  onChange={handleChange}
                >
                  {batches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      {batch.Bcode} - {batch.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Year_id">Year</InputLabel>
                <Select
                  labelId="Year_id"
                  id="Year_id"
                  name="Year_id"
                  value={student.Year_id}
                  label="Year"
                  onChange={handleChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Sem_id">Semester</InputLabel>
                <Select
                  labelId="Sem_id"
                  id="Sem_id"
                  name="Sem_id"
                  value={student.Sem_id}
                  label="Semester"
                  onChange={handleChange}
                >
                  {sems.map((sem) => (
                    <MenuItem key={sem.id} value={sem.id}>
                      {sem.code} - {sem.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="term_id">Term</InputLabel>
                <Select
                  labelId="term_id"
                  id="term_id"
                  name="term_id"
                  value={student.term_id}
                  label="Term"
                  onChange={handleChange}
                >
                  {terms.map((term) => (
                    <MenuItem key={term.id} value={term.id}>
                      {term.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="Status_ID">Status</InputLabel>
                <Select
                  labelId="Status_ID"
                  id="Status_ID"
                  name="Status_ID"
                  value={student.Status_ID}
                  label="Status"
                  onChange={handleChange}
                >
                  {statusList.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id="DateofJoin"
                label="Date of Joining"
                name="DateofJoin"
                type="date"
                value={student.DateofJoin}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="DateofEnd"
                label="Date of Ending"
                name="DateofEnd"
                type="date"
                value={student.DateofEnd}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="submit" variant="contained" disabled={loader}>
                  {loader ? <CircularProgress size={24} /> : "Update Student"}
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default StudentUpdate;
