import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TableContainer,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import api from "../axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { checkPermissions } from "../Helper/RolePermission";

const StudentView = () => {
  const [degrees, setDegrees] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);

  useEffect(() => {
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (selectedDegree) {
      fetchProgramsByDegree(selectedDegree);
      fetchYearsByDegree(selectedDegree);
    } else {
      setPrograms([]);
      setYears([]);
    }
  }, [selectedDegree]);

  useEffect(() => {
    if (selectedProgram) {
      fetchBatchesByProgram(selectedProgram);
    } else {
      setBatches([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedYear) {
      fetchSemestersByYear(selectedYear);
    } else {
      setSemesters([]);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedSemester) {
      fetchTermsBySemester(selectedSemester);
    } else {
      setTerms([]);
    }
  }, [selectedSemester]);

  useEffect(() => {
    fetchStudents();
  }, [
    currentPage,
    pageSize,
    selectedDegree,
    selectedProgram,
    selectedBatch,
    selectedYear,
    selectedSemester,
    selectedTerm,
    search,
  ]);

  const fetchDegrees = async () => {
    try {
      const response = await api.get("/auth6/degrees");
      setDegrees(response.data.degrees);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchProgramsByDegree = async (degreeId) => {
    try {
      const response = await api.get(`/auth6/programs/${degreeId}`);
      setPrograms(response.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchBatchesByProgram = async (programId) => {
    try {
      const response = await api.get(`/auth6/batches/${programId}`);
      setBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchYearsByDegree = async (degreeId) => {
    try {
      const response = await api.get(`/auth6/years/${degreeId}`);
      setYears(response.data.years);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchSemestersByYear = async (yearId) => {
    try {
      const response = await api.get(`/auth6/semesters/${yearId}`);
      setSemesters(response.data.semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchTermsBySemester = async (semesterId) => {
    try {
      const response = await api.get(`/auth6/terms/${semesterId}`);
      setTerms(response.data.terms);
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        pageSize,
        degreeId: selectedDegree,
        programId: selectedProgram,
        batchId: selectedBatch,
        yearId: selectedYear,
        semesterId: selectedSemester,
        termId: selectedTerm,
        search,
      });
      const response = await api.get(`/auth6/students?${queryParams}`);
      setStudents(response.data.students);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedProgram("");
    setSelectedBatch("");
    setSelectedYear("");
    setSelectedSemester("");
    setSelectedTerm("");
    setSearch("");
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/student/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this student record?")
    ) {
      api
        .delete(`/auth/student/${id}`)
        .then((result) => {
          if (result.data) {
            setStudents(students.filter((item) => item.id !== id)); // Remove deleted batch from state
            alert("Record deleted successfully!");
          } else {
            alert("Failed to delete the record.");
          }
        })
        .catch((err) => console.log(err));
      alert("Foreign Key");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (
      date.getFullYear() === 1990 &&
      date.getMonth() === 0 &&
      date.getDate() === 1
    ) {
      return "-";
    } else {
      const year = date.getFullYear();
      const month = date.toLocaleString("en-us", { month: "short" }); // Get month as abbreviation (e.g., Apr)
      const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero if needed
      return `${day} ${month} ${year}`;
    }
  };

  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of Students Shown Below:-</h3>
      </div>
      {permissions.canAdd && (
        <Link to="/dashboard/student/add" className="btn btn-success">
          Add Student
        </Link>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Degree</InputLabel>
            <Select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {degrees.map((degree) => (
                <MenuItem key={degree.id} value={degree.id}>
                  {degree.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Program</InputLabel>
            <Select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              disabled={!selectedDegree}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.code} - {program.Sname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Batch</InputLabel>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={!selectedProgram}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {batches.map((batch) => (
                <MenuItem key={batch.id} value={batch.id}>
                  {batch.Bcode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedDegree}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Semester</InputLabel>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedYear}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {semesters.map((semester) => (
                <MenuItem key={semester.id} value={semester.id}>
                  {semester.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Term</InputLabel>
            <Select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              disabled={!selectedSemester}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {terms.map((term) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={8} md={10}>
          <TextField
            fullWidth
            margin="normal"
            label="Search Students"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or unique ID"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <button
            onClick={resetFilters}
            style={{
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            Reset Filters
          </button>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unique ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date of Join</TableCell>
                <TableCell>Date of End</TableCell>
                {permissions.canEdit && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.uid}</TableCell>
                  <TableCell>{student.FirstName}</TableCell>
                  {/* <TableCell>{student.lastName}</TableCell> */}
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <b>{formatDate(student.DateofJoin)}</b>
                  </TableCell>
                  <TableCell>
                    <b>{formatDate(student.DateofEnd)}</b>
                  </TableCell>
                  <TableCell>
                    {permissions.canEdit && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(student.id)}
                      >
                        Edit
                      </button>
                    )}
                    {permissions.canDelete && (
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalPages * pageSize} // Replace with the actual total number of rows
          rowsPerPage={pageSize}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Paper>
    </div>
  );
};

export default StudentView;
