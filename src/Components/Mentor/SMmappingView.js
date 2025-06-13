import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
import { Autocomplete } from "@mui/material";
// import PaginationToolbar from "../PaginationToolbar";

const SMmappingView = ({student, staffs}) => {
  const [academic, setAcademic] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [staff1, setStaff1] = useState([]);
  const [selectedStaff1, setSelectedStaff1] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [selectedStaffs, setSelectedStaffs] = useState(null);

  useEffect(() => {
    // Fetch program
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/program`)
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
      });

    // Fetch From Staff
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/search/staff`)
      .then((response) => {
        setStaff(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
      });

    // Fetch To Staff
    axios
    .get(`${process.env.REACT_APP_API_URL}/auth/search/staff`)
    .then((response) => {
      setStaff1(response.data);
    })
    .catch((error) => {
      console.error("Error fetching staff:", error);
    });

     // Fetch default mentor data from the database for each student
  axios
  .get(`${process.env.REACT_APP_API_URL}/auth/mentors`) // Adjust the endpoint as per your backend API
  .then((response) => {
    // Map the mentor data to set the initial state of selectedStaffs
    const initialSelectedStaffs = {};
    response.data.forEach((mentor) => {
      // Assuming there is a mapping between students and mentors in the backend response
      initialSelectedStaffs[mentor.studentId] = mentor.staffId;
    });
    setSelectedStaffs(initialSelectedStaffs);
  })
  .catch((error) => {
    console.error("Error fetching default mentors:", error);
  });
  }, []);

  const handleProgramChange = (event) => {
    const selectedProgramId = event.target.value;
    setSelectedProgram(selectedProgramId);
    fetchBatches(selectedProgramId);
  };

  const fetchBatches = (programId) => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/batch/${programId}`)
      .then((response) => {
        setBatches(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching batches:", error);
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

  // Check if all students are selected
  const isAllSelected =
    students.length > 0 &&
    students.every(({ id }) => selectedStudents.includes(id));

  // Handle select all students
  const handleSelectAllStudents = (event) => {
    if (event.target.checked) {
      setSelectedStudents(students.map(({ id }) => id));
    } else {
      setSelectedStudents([]);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Assuming you have an endpoint to fetch student data based on Batch_id
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/students/${selectedBatch}`)
      .then((response) => {
        setStudents(response.data); // Assuming student data is stored in students state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        setLoading(false);
      });
  };

  const handleRegisterClick = () => {
    setLoading(true);

    const data = {
      selectedStudents: selectedStudents,
      selectedStaffs: selectedStaffs,
      selectedBatch: selectedBatch,
      fromDate: startDate,
      toDate: endDate
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/smmapping/save`, data)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        // Handle success response
      })
      .catch((error) => {
        console.error("Error registering students:", error);
        setLoading(false);
        // Handle error response
      });
  };

  const handleSelectStaff = (studentId, staff) => {
    setSelectedStaffs((prevSelectedStaffs) => ({
      ...prevSelectedStaffs,
      [studentId]: staff,
    }));
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>
          List of Student - Mentor - Mapping Shown Below:-
        </h3>
      </div>
      <Link to="/dashboard/smmappingview" className="btn btn-success">
        Add Mentor
      </Link>

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
        <Grid container spacing={6}>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="program-label">Program</InputLabel>
              <Select
                labelId="program-label"
                id="program"
                value={selectedProgram}
                label="Program"
                onChange={handleProgramChange}
                fullWidth
              >
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.code} - {program.Sname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                id="batch"
                value={selectedBatch}
                label="Batch"
                onChange={(e) => setSelectedBatch(e.target.value)}
                fullWidth
              >
                {batches.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.Bcode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="startdate"
              label="Starting Date:"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="enddate"
              label="Ending Date:"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
          <TableCell><b>Student ID</b></TableCell>
          <TableCell><b>Name of the Students</b></TableCell>
          <TableCell><b>Name of the Mentor</b></TableCell>
          <TableCell>
            <GreenButton variant="contained" sx={{ mt: 1, mb: 2, mr: 2 }} onClick={handleRegisterClick}>
              Register
            </GreenButton>
            {/* <GreenButton variant="contained" sx={{ mt: 1, mb: 2 }} onClick={handleRegisterClick}>
              Update
            </GreenButton> */}
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
            <TableCell>
              <Autocomplete
                id={`staff-${student.id}`}
                disablePortal
                options={staff}
                getOptionLabel={(option) => `${option.StaffCode} - ${option.FirstName}`}
                value={selectedStaffs[student.id] || null}
                onChange={(event, newValue) => handleSelectStaff(student.id, newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="From Staff" placeholder="Search Staff..." />
                )}
              />
            </TableCell>
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

export default SMmappingView;
