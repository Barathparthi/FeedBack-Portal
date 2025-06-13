import React, { useState } from "react";
import {
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { LightPurpleButton, GreenButton } from "../buttonStyles";
import axios from "axios";

const Attendance = () => {
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [selectedDescription, setSelectedDescription] = useState("");


    const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Make API call to fetch attendance data based on selected date
    fetchAttendanceData(startDate)
      .then((data) => {
        setAttendanceData(data);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchAttendanceData = async (date) => {
    try {
      const response = await fetch(`https://eback-production.up.railway.app/auth/attendance?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  
  const handleSubmit1 = (event) => {
    event.preventDefault();
    // Fetch students based on selected date
    fetchStudents(startDate);
  };

  const fetchStudents = (date) => {
    fetch(`https://eback-production.up.railway.app/auth/attend?date=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        // Handle error
      });
  };

  const handleRegisterMeeting = async (event) => {
    // Create a meeting object with selected values
    const meetingData = {

      student: selectedStudents,
      // building: selectedBuilding,
      // venue: selectedVenue,
      comment: selectedDescription,
      date: startDate,
    };
    // Send POST request to backend API endpoint
    axios
      .post("https://eback-production.up.railway.app/auth/meeting/attend", meetingData)
      .then((response) => {
        console.log("Meeting created successfully");
        setSelectedStudents([]);
      })
      .catch((error) => {
        console.error("Error creating meeting:", error);
      });
  };

  return (
    <Box mt={3} mx="auto" maxWidth="800px">
      <Typography variant="h5" align="center" color="primary" mb={2}>
        Attendance
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} mb={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="startdate"
                label="Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <LightPurpleButton type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "View"}
              </LightPurpleButton>
            </Grid>
          </Grid>
        </Box>
        {attendanceData.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
                  <b>Building</b>
                </TableCell>
                <TableCell>
                  <b>Time</b>
                </TableCell>
                <TableCell>
                  <b>Venue</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.building}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.venue}</TableCell>
                  <TableCell>
                <GreenButton
                  variant="contained"
                  onClick={handleSubmit1}
                >
                  Select
                </GreenButton>
              </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      {/* Display selected students */}
      <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>UniqueID</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Comments</b>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.uid}</TableCell>
                <TableCell>{student.FirstName}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    id={`comment-${index}`}
                    label="Comments"
                    variant="outlined"
                    value={selectedDescription} // Set the value of the TextField to selectedDescription
    onChange={(e) => setSelectedDescription(e.target.value)} // Update selectedDescription when the value changes
                  />
                </TableCell>
                <TableCell>
                  <GreenButton variant="contained">Save</GreenButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Attendance;

