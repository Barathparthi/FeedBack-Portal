import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LightPurpleButton } from "../buttonStyles";
import api from "../axiosInstance";
import { checkPermissions } from "../Helper/RolePermission";
import { motion } from 'framer-motion';

const GroupView = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState([]);
  const [loader, setLoader] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");

  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [degrees, setDegrees] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [roleId, setRoleId] = useState(null); // State to hold roleId

  // Get roleId from localStorage/sessionStorage when component mounts
  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);
  // ... (previous state variables remain the same)

  // Edit handler
  const handleEdit = (id) => {
    // Navigate to edit page with the group ID
    navigate(`/dashboard/group/edit/${id}`);
  };

  // Delete confirmation dialog handler
  const handleDeleteConfirmation = (group) => {
    setGroupToDelete(group);
    setDeleteConfirmOpen(true);
  };

  // Actual delete operation
  const handleDelete = () => {
    if (!groupToDelete) return;

    setLoader(true);
    api
      .delete(`/auth4/group/${groupToDelete.id}`)
      .then(() => {
        // Remove the deleted group from the list
        setGroup(group.filter((g) => g.id !== groupToDelete.id));
        setDeleteConfirmOpen(false);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
        setLoader(false);
        // Optionally show an error message to the user
      });
  };

  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteConfirmOpen(false);
    setGroupToDelete(null);
  };

  // ... (rest of the previous code remains the same)

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoader(true);

    // Only include selected filters in the payload
    const payload = {};
    if (selectedAcademicYear) payload.AcademicYear_id = selectedAcademicYear;
    if (selectedProgram) payload.program_id = selectedProgram;
    if (selectedYear) payload.Year_id = selectedYear;
    if (selectedSemester) payload.Sem_id = selectedSemester;
    if (selectedTerm) payload.Term_id = selectedTerm;

    api
      .post(`/auth4/groupview`, payload)
      .then((response) => {
        setGroup(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setLoader(false);
      });
  };

  // Auto-fetch groups when filters change
  useEffect(() => {
    if (
      selectedAcademicYear ||
      selectedProgram ||
      selectedYear ||
      selectedSemester ||
      selectedTerm
    ) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [
    selectedAcademicYear,
    selectedProgram,
    selectedYear,
    selectedSemester,
    selectedTerm,
  ]);

  useEffect(() => {
    // Fetch initial data
    api
      .get(`/auth4/academic`)
      .then((response) => setAcademicYears(response.data))
      .catch((error) => console.error("Error fetching Academic Years:", error));

    api
      .get(`/auth4/degree`)
      .then((response) => setDegrees(response.data))
      .catch((error) => console.error("Error fetching Degrees:", error));

    api
      .get(`/auth4/term`)
      .then((response) => setTerms(response.data))
      .catch((error) => console.error("Error fetching Terms:", error));
  }, []);

  const handleDegreeChange = (event) => {
    const degreeId = event.target.value;
    setSelectedDegree(degreeId);

    // Reset dependent fields
    setSelectedProgram("");
    setSelectedYear("");
    setSelectedSemester("");

    // Fetch dependent data
    if (degreeId) {
      api
        .get(`/auth4/program/${degreeId}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching Programs:", error));

      api
        .get(`/auth4/year/${degreeId}`)
        .then((response) => setYears(response.data))
        .catch((error) => console.error("Error fetching Years:", error));
    }
  };

  const handleYearChange = (event) => {
    const yearId = event.target.value;
    setSelectedYear(yearId);
    setSelectedSemester(""); // Reset semester when year changes

    if (yearId) {
      api
        .get(`/auth4/semester/${yearId}`)
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching Semesters:", error));
    }
  };

  const handleClearFilters = () => {
    setSelectedAcademicYear("");
    setSelectedDegree("");
    setSelectedProgram("");
    setSelectedYear("");
    setSelectedSemester("");
    setSelectedTerm("");
    setGroup([]);
  };

  // Get the permissions for the current roleId
  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
              <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
      <div className="d-flex justify-content-between align-items-center">
        <h3 style={{ color: "red" }}>List of Groups</h3>
        <Link to="/dashboard/group/add" className="btn btn-success">
          Add Group
        </Link>
      </div>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1, width: "100%" }}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={selectedAcademicYear}
                label="Academic Year"
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Degree</InputLabel>
              <Select
                value={selectedDegree}
                label="Degree"
                onChange={handleDegreeChange}
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
                label="Program"
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
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={handleYearChange}
                disabled={!selectedDegree}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.description}
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
                label="Semester"
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
                label="Term"
                onChange={(e) => setSelectedTerm(e.target.value)}
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
        </Grid>

        <div className="d-flex gap-2 mt-3">
          <LightPurpleButton
            type="submit"
            variant="contained"
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} color="inherit" /> : "View"}
          </LightPurpleButton>

          <LightPurpleButton
            type="button"
            variant="outlined"
            onClick={handleClearFilters}
          >
            Clear Filters
          </LightPurpleButton>
        </div>
      </Box>

      <div className="mt-4">
        {group.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Group Code</th>
                <th>Description</th>
                {permissions.canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {group.map((g) => (
                <tr key={g.id}>
                  <td style={{ color: "red" }}>
                    <b>{g.code}</b>
                  </td>
                  <td>
                    <b>{g.description}</b>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* {permissions.canEdit && (
                       <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => handleEdit(g.id)}
                      >
                        Edit
                      </Button> 
                    )} */}
                      {permissions.canDelete && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteConfirmation(g)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">
            <p>No groups found with the selected filters.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the group "{groupToDelete?.code}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      </motion.div>
    </div>
  );
};

export default GroupView;
