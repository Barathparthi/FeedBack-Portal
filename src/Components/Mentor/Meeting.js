import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { GreenButton, LightPurpleButton } from "../buttonStyles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { Autocomplete } from "@mui/material";
// import PaginationToolbar from "../PaginationToolbar";

const Meeting = ({ student, staffs }) => {
  const [academic, setAcademic] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [description, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");
  const navigate = useNavigate();

  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [Term, setTerm] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState([]);

  const [Meeting, setMeeting] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState([]);

  const [Building, setBuilding] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [Venue, setVenue] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [time, settime] = useState(null);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [error, setError] = useState(null); // State variable to hold error message

  const [loading, setLoading] = useState(false);

  const [selectedStaffs, setSelectedStaffs] = useState({});

  useEffect(() => {
    // Fetch Academic Years
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/academic`)
      .then((response) => {
        setAcademicYears(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Academic Years:", error);
      });

          // Fetch Term
    axios
    .get(`${process.env.REACT_APP_API_URL}/auth/term`)
    .then((response) => {
      setTerm(response.data);
    })
    .catch((error) => {
      console.error("Error fetching Term:", error);
    });

          // Fetch MeetingType
          axios
          .get(`${process.env.REACT_APP_API_URL}/auth/meetingtype`)
          .then((response) => {
            setMeeting(response.data);
          })
          .catch((error) => {
            console.error("Error fetching Term:", error);
          });

                    // Fetch Building
    axios
    .get(`${process.env.REACT_APP_API_URL}/auth/building`)
    .then((response) => {
      setBuilding(response.data);
    })
    .catch((error) => {
      console.error("Error fetching Term:", error);
    });

              // Fetch Venue
              axios
              .get(`${process.env.REACT_APP_API_URL}/auth/venue`)
              .then((response) => {
                setVenue(response.data);
              })
              .catch((error) => {
                console.error("Error fetching Term:", error);
              });
     }, []);

     const handleSubmit = (event) => {
      event.preventDefault();
      setLoading(true);
      // Assuming you have an endpoint to fetch student data based on Batch_id
      axios
        .get(`${process.env.REACT_APP_API_URL}/auth/student1`)
        .then((response) => {
          setStudents(response.data); // Assuming student data is stored in students state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
          setLoading(false);
        });
    };

  // Function to handle selection of students
  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  //   // Function to handle selection of students
  //   const handleSelectStudent = (studentId) => {
  //     setSelectedStudents((prevSelected) =>
  //       prevSelected.includes(studentId)
  //         ? prevSelected.filter((id) => id !== studentId)
  //         : [...prevSelected, studentId]
  //     );
  //   };

  //   // Check if all students are selected
  //   const isAllSelected =
  //     students.length > 0 &&
  //     students.every(({ id }) => selectedStudents.includes(id));

  //   // Handle select all students
  //   const handleSelectAllStudents = (event) => {
  //     if (event.target.checked) {
  //       setSelectedStudents(students.map(({ id }) => id));
  //     } else {
  //       setSelectedStudents([]);
  //     }
  //   };

  const handleRegisterMeeting = async (event) => {
    // Create a meeting object with selected values
    const meetingData = {
      academicYear: selectedAcademicYear,
      term: selectedTerm,
      meetingType: selectedMeeting,
      student: selectedStudents,
      building: selectedBuilding,
      venue: selectedVenue,
      agenda: selectedDescription,
      date: startDate,
      time: time,
      selectedStudents: selectedStudents,
    };
    // Send POST request to backend API endpoint
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/meeting/create`, meetingData)
      .then((response) => {
        console.log("Meeting created successfully");
        console.log("Meeting created successfully");
        // Reset selected values and selected students
        setSelectedAcademicYear("");
        setSelectedTerm("");
        setSelectedMeeting("");
        setSelectedBuilding("");
        setSelectedVenue("");
        setStartDate("");
        settime("");
        setDescriptions("");
        setSelectedStudents([]);
      })
      .catch((error) => {
        console.error("Error creating meeting:", error);
      });
  };
  

  
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>Meeting Schedule :-</h3>
      </div>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="academic-year-label">Academic Year</InputLabel>
              <Select
                labelId="academic-year-label"
                id="academic-year"
                value={selectedAcademicYear}
                label="Academic Year"
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                fullWidth
              >
                {academicYears.map((academic) => (
                  <MenuItem key={academic.id} value={academic.id}>
                    {academic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="term-label">Term</InputLabel>
              <Select
                labelId="term-label"
                id="term"
                value={selectedTerm}
                label="Term"
                onChange={(e) => setSelectedTerm(e.target.value)}
                fullWidth
              >
                {Term.map((term) => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="meeting-label">Type of Meeting</InputLabel>
              <Select
                labelId="meeting-label"
                id="meeting"
                value={selectedMeeting}
                label="Meeting"
                onChange={(e) => setSelectedMeeting(e.target.value)}
                fullWidth
              >
                {Meeting.map((Meet) => (
                  <MenuItem key={Meet.id} value={Meet.id}>
                    {Meet.code} - {Meet.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="build">Building</InputLabel>
              <Select
                labelId="build"
                id="build"
                value={selectedBuilding}
                label="Building"
                onChange={(e) => setSelectedBuilding(e.target.value)}
                fullWidth
              >
                {Building.map((build) => (
                  <MenuItem key={build.id} value={build.id}>
                    {build.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="venue">Venue</InputLabel>
              <Select
                labelId="venue"
                id="venue"
                value={selectedVenue}
                label="Venue"
                onChange={(e) => setSelectedVenue(e.target.value)}
                fullWidth
              >
                {Venue.map((venue) => (
                  <MenuItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
  <TextField
    margin="normal"
    required
    fullWidth
    id="agenda"
    label="Agenda"
    name="agenda"
    autoComplete="off"
    value={selectedDescription} // Set the value of the TextField to selectedDescription
    onChange={(e) => setSelectedDescription(e.target.value)} // Update selectedDescription when the value changes
  />
</Grid>


          <Grid item xs={3}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="startdate"
              label="Date:"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <TimePicker
                label="Time :"
                value={time}
                onChange={(newValue) => settime(newValue)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              /> */}
                          <TextField
              margin="normal"
              required
              fullWidth
              id="startdate"
              label="Date:"
              type="time"
              value={time}
              onChange={(e) => settime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Add more Grid container/row configurations for additional field groups */}

        <LightPurpleButton
          type="Submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {loader ? <CircularProgress size={24} color="inherit" /> : "view"}
        </LightPurpleButton>
      </Box>
      <div className="mt-2">
        <Table style={{ backgroundColor: "white" }}>
          <TableHead>
            <TableRow style={{ color: "black" }}>
              <TableCell padding="checkbox">
              <Checkbox
              color="primary"
              indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
              checked={selectedStudents.length === students.length}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedStudents(students.map((student) => student.id));
                } else {
                  setSelectedStudents([]);
                }
              }}
            /> 
              </TableCell>
              <TableCell>
                <b>Student ID</b>
              </TableCell>
              <TableCell>
                <b>Name of the Students</b>
              </TableCell>
              {/* <TableCell><b>Name of the Mentor</b></TableCell> */}
              <TableCell>
                <GreenButton
                  variant="contained"
                  sx={{ mt: 1, mb: 2, mr: 2 }}
                  onClick={handleRegisterMeeting}
                  disabled={selectedStudents.length ===0}
                >
                  Register
                </GreenButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {students.map((student) => (
          <TableRow key={student.id} selected={selectedStudents.includes(student.id)}>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleSelectStudent(student.id)}
              />
            </TableCell>
            <TableCell style={{ color: "red" }}><b>{student.uid}</b></TableCell>
            <TableCell><b>{student.FirstName}</b></TableCell>
          </TableRow>
        ))}
      </TableBody> 
        </Table>
      </div>
      <div style={{ backgroundColor: "white" }}>
        <div className="d-flex justify-content-center">
          <label>
            Page Size:
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              style={{ backgroundColor: "red", color: "white" }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
          </label>
          {"\u00A0"}
          {"\u00A0"}
          {"\u00A0"}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ backgroundColor: "#04AA6D", color: "white" }}
          >
            Previous Page
          </button>
          <span className="mx-2">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{ backgroundColor: "#04AA6D", color: "white" }}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meeting;


