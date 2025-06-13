import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ArrowDropDownIcon  from "@mui/icons-material/ArrowDropDown";
import api from "../axiosInstance";
const ExampleForm = () => {
  const navigate = useNavigate();
  const { page = 2 } = useParams();
  const [academicYearData, setAcademicYearData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [termData, setTermData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [fbTypeData, setFbTypeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [formData, setFormData] = useState({
    academicYear: "",
    year: "",
    semester: "",
    term: "",
    course: "",
    staff: "",
    group: "",
    fbType: "",
    category: "",
    degree: "",
    startDate: "",
    endDate: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [pageSize, setPageSize] = useState(10);
  const [exampleForm,setExampleform] = useState([]);   
  const [roleId, setRoleId] = useState(null);  
  const [totalPages, setTotalPages] = useState(null);
  const [isloading, setIsLoading] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchData = async (endpoint, setter) => {
    try {
      const res = await api.get(`/auth3/${endpoint}`);
      const data = res.data;
      setter(data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };
  useEffect(() => {
    fetchData("academicyear", setAcademicYearData);
    fetchData("term", setTermData);
    fetchData("course", setCourseData);
    fetchData("staff", setStaffData);
    fetchData("groups", setGroupData);
    fetchData("category", setCategoryData);
    fetchData("degree", setDegreeData);
    fetchData("", setFbTypeData);
  }, []);
  
  // Updated to use axios.get instead of fetch
  const fetchYearDataByDegree = async (degreeId) => {
    try {
      const res = await api.get(
        `/auth3/yearByDegree?degreeId=${degreeId}`
      );
      const data = res.data;
      setYearData(data);
    } catch (err) {
      console.error("Error fetching years by degree:", err);
    }
  };
  
  // Updated to use axios.get instead of fetch
  const fetchSemesterData = async (yearId) => {
    try {
      const res = await api.get(
        `/auth3/semesterByYear?yearId=${yearId}`
      );
      const data = res.data;
      setSemesterData(data);
    } catch (err) {
      console.error("Error fetching semesters:", err);
    }
    };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // This now updates with the ID
    }));
    if (name === "degree") {
      const selectedDegree = degreeData.find((degree) => degree.id === value);
      if (selectedDegree) {
        setFormData((prevData) => ({
          ...prevData,
          year: "",
          semester: "",
          fbType: "",
          category: "",
          course: "",
          staff: "",
        }));
        fetchYearDataByDegree(selectedDegree.id);
        setSemesterData([]);
      }
    }
    if (name === "year") {
      const selectedYear = yearData.find((year) => year.id === value);
      if (selectedYear) {
        fetchSemesterData(selectedYear.id);
        setFormData((prevData) => ({
          ...prevData,
          semester: "",
        }));
      }
    }
  };
  const handleAutocompleteChange = (event, value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? { id: value.id } : null, // Ensure id is stored
    }));
  };
  

  const handleViewClick = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleAddEntry = async (e) => {
    e.preventDefault();
    // Ensure formData.course and formData.staff are properly handled (access their id)
    const submissionData = {
      AyId: formData.academicYear,
      YearId: formData.year,
      SemId: formData.semester,
      TermId: formData.term,
      CourseId: formData.course?.id,  // Access the id from the course object
      StaffId: formData.staff?.id,    // Access the id from the staff object
      GroupId: formData.group,
      FbtypeId: formData.fbType,
      FbCategoryId: formData.category,
      Sdate: formData.startDate,
      Edate: formData.endDate,
    };
  
    try {
      const response = await api.post(
        `/auth3/afeedbackconfig`,
        submissionData
      );
      
      if (response.status === 201) {
        alert("Feedback record added successfully!");
        // console.log("New feedback ID:", response.data.id);
        
        // Reset form after successful submission
        setFormData({
          academicYear: "",
          year: "",
          semester: "",
          term: "",
          course: "",    // Reset to null (since it's an object)
          staff: "",     // Reset to null (since it's an object)
          group: "",
          fbType: "",
          category: "",
          startDate: "",
          endDate: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit feedback configuration.");
    }
  };
  
  const resetFormData = () => {
    setFormData({
      academicYear: "",
      year: "",
      semester: "",
      term: "",
      course: "",
      staff: "",
      group: "",
      fbType: "",
      category: "",
      degree: "",
      startDate: "",
    });
  };
  const handleEditEntry = (index) => {
    setFormData(entries[index]);
    setEditingIndex(index);
    setDialogOpen(true);
  };
  const handleDeleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth3/rating-options?page=${currentPage}&size=${pageSize}`)
      .then((result) => {
        // console.log(result.data); // Check API response in the console
        if (result.data.feedbackcategory) {
          setExampleform(result.data.exampleForm);  // Set batch data
          setTotalPages(result.data.totalPages);  // Set total pages
          setTotalRecords(result.data.totalRecords); // Set total records
        } else {
          console.log(result.data.error);
        }
        setIsLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, [currentPage, pageSize]);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <Grid container justifyContent="center" spacing={0} sx={{ mt: 2 }}>
      <Grid item xs={12} md={8} lg={12}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Config
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Please Enter Config Details below
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                >
                  {academicYearData.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
                        <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Group</InputLabel>
                <Select
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                >
                  {groupData.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.code} - {group.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Degree</InputLabel>
                <Select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                >
                  {degreeData.map((degree) => (
                    <MenuItem key={degree.id} value={degree.id}>
                      {degree.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                >
                  {yearData.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                >
                  {semesterData.map((semester) => (
                    <MenuItem key={semester.id} value={semester.id}>
                      {semester.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Term</InputLabel>
                <Select
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                >
                  {termData.map((term) => (
                    <MenuItem key={term.id} value={term.id}>
                      {term.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
  <Autocomplete
    options={courseData}
    getOptionLabel={(option) => `${option.code} - ${option.description}`} // Display code and description
    onChange={(e, value) => handleAutocompleteChange(e, value, "course")} 
    renderInput={(params) => (
      <TextField {...params} label="Course" fullWidth sx={{ p: 1 }} />
    )}
  />
</Grid>
<Grid item xs={6} sm={3}>
  <Autocomplete
    options={staffData}
    getOptionLabel={(option) => `${option.StaffCode} - ${option.FirstName}`} // Display staff code and name
    onChange={(e, value) => handleAutocompleteChange(e, value, "staff")} // Pass 'staff' instead of 'staff.id'
    renderInput={(params) => (
      <TextField {...params} label="Staff" fullWidth sx={{ p: 1 }} />
    )}
  />
</Grid>



            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  name="fbType"
                  value={formData.fbType}
                  onChange={handleInputChange}
                >
                  {fbTypeData.map((fbType) => (
                    <MenuItem key={fbType.id} value={fbType.id}>
                      {fbType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth sx={{ p: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categoryData.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                fullWidth
                sx={{ p: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                fullWidth
                sx={{ p: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEntry}
              >
                {editingIndex >= 0 ? "Save" : "Add"}
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} align="center">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleViewClick}
              >
                View Data
              </Button>
            </Grid>
          </Grid>
      <div style={{ backgroundColor: 'white', padding: '10px', position: 'relative' }}>
        <div className="d-flex justify-content-center" style={{ alignItems: 'center', height: '35px', position: 'fixed', bottom: '0', width: '100%' }}>
          <div>Page Size:</div>
          <label style={{ position: 'relative', display: 'inline-block' }}>
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(parseInt(e.target.value))} 
              className="form-control" 
              style={{ height: '30px', fontSize: '12px', appearance: 'none', paddingRight: '25px' }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
            <ArrowDropDownIcon style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </label>

          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1} 
            className="btn btn-sm btn-success" 
            style={{ padding: '5px 6px', fontSize: '12px' }}>
            Previous Page
          </button>

          <span className="mx-2" style={{ fontSize: '12px' }}>Page {currentPage} of {totalPages}</span>

          <button 
            onClick={handleNextPage} 
            disabled={currentPage >= totalPages} 
            className="btn btn-sm btn-success" 
            style={{ padding: '5px 6px', fontSize: '12px' }}>
            Next Page
          </button>
        </div>
      </div>
            {/* <Typography>Page Size:</Typography> */}
          
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>View Data</DialogTitle>
            <DialogContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Academic Year</TableCell>
                      <TableCell>Degree</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>Term</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Staff</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Feedback Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.academicYear}</TableCell>
                        <TableCell>{entry.degree}</TableCell>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>{entry.semester}</TableCell>
                        <TableCell>{entry.term}</TableCell>
                        <TableCell>{entry.course}</TableCell>
                        <TableCell>{entry.staff}</TableCell>
                        <TableCell>{entry.group}</TableCell>
                        <TableCell>{entry.fbType}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.startDate}</TableCell>
                        <TableCell>{entry.endDate}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditEntry(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteEntry(index)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default ExampleForm;