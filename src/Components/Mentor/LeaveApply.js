import React, { useEffect, useState } from "react";
import {
  Alert,
  Grid,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import { GreenButton, LightPurpleButton } from "../buttonStyles";

const LeaveApply = () => {
    const [loader, setLoader] = useState(false);

  const [leave, setLeave] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState("");

  const [Fsession, setFsession] = useState([]);
  const [selectedFsession, setSelectedFsession] = useState("");

  const [Tsession, setTsession] = useState([]);
  const [selectedTsession, setSelectedTsession] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);

  useEffect(() => {
    // Fetch data for leave, from session, to session
    // Example:
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("API_URL");
    //     const data = await response.json();
    //     // Set data to state variables
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log("Form submitted!");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h1 style={{ color: "red" }}>Leave Application Form:-</h1>
      </div>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={3}>
          {/* Leave Type */}
          <Grid item xs={4}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="leave">Type of Leave</InputLabel>
              <Select
                labelId="leave"
                id="leave"
                value={selectedLeave}
                label="Leave Apply"
                onChange={(e) => setSelectedLeave(e.target.value)}
                fullWidth
              >
                {leave.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* From Session */}
          <Grid item xs={4}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="fsession">From Session</InputLabel>
              <Select
                labelId="fsession"
                id="fsession"
                value={selectedFsession}
                label="From Session"
                onChange={(e) => setSelectedFsession(e.target.value)}
                fullWidth
              >
                {Fsession.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* To Session */}
          <Grid item xs={4}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="tsession">To Session</InputLabel>
              <Select
                labelId="tsession"
                id="tsession"
                value={selectedTsession}
                label="From Session"
                onChange={(e) => setSelectedTsession(e.target.value)}
                fullWidth
              >
                {Tsession.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Starting Date */}
          <Grid item xs={4}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="startdate"
              label="Starting Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* Ending Date */}
          <Grid item xs={4}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="enddate"
              label="Ending Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* Description */}
          <Grid item xs={4}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
          </Grid>
          {/* Upload Document */}
          <Grid item xs={4}>
            <input
              type="file"
              id="upload-document"
              name="upload-document"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="upload-document">
              <Button variant="contained" component="span">
                Upload Document
              </Button>
            </label>
          </Grid>
          <LightPurpleButton
          type="Submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {loader ? <CircularProgress size={24} color="inherit" /> : "Apply"}
        </LightPurpleButton>
        </Grid>
      </Box>

    </div>
  );
};

export default LeaveApply;