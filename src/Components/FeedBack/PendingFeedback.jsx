import React, { Component } from "react";
import {
  Container,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import logo from '../../assets/Sret logo.png';
import { Download as DownloadIcon } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../axiosInstance";

class PendingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Dropdown options
      academicYears: [],
      feedbackTypes: [],
      feedbackCategories: [],
      groups: [],
      courses: [],
      years: [],
      semesters: [],
      terms: [],
      staffs: [],

      // Selected values
      selectedAcademicYear: null,
      selectedGroup: null,
      selectedFeedbackType: null,
      selectedFeedbackCategory: null,
      selectedCourse: null,

      // Autofilled values
      autofilledYear: null,
      autofilledSemester: null,
      autofilledTerm: null,
      autofilledStaff: null,

      // Pending students data
      pendingStudents: [],
      programs: [],

      // Loading state
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData = async () => {
    try {
      // Fetch academic years
      const academicYearsRes = await api.get("/auth7/academic-years");
      this.setState({ academicYears: academicYearsRes.data });

      // Fetch feedback types
      const feedbackTypesRes = await api.get("/auth7/feedback-types");
      this.setState({ feedbackTypes: feedbackTypesRes.data });

      // Fetch feedback categories
      const feedbackCategoriesRes = await api.get("/auth7/categories");
      this.setState({ feedbackCategories: feedbackCategoriesRes.data });

      // Fetch years
      const yearsRes = await api.get("/auth7/years");
      this.setState({ years: yearsRes.data });

      // Fetch semesters
      const semestersRes = await api.get("/auth7/semesters");
      this.setState({ semesters: semestersRes.data });

      // Fetch terms
      const termsRes = await api.get("/auth7/terms");
      this.setState({ terms: termsRes.data });

      // Fetch staff
      const staffsRes = await api.get("/auth7/staff");
      this.setState({ staffs: staffsRes.data });

      // Fetch programs
      const programsRes = await api.get("/auth7/programs");
      this.setState({ programs: programsRes.data });

    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  fetchGroups = async (academicYearId) => {
    if (!academicYearId) {
      this.setState({ groups: [], selectedGroup: null });
      return;
    }
    try {
      const res = await api.get(`/auth7/groups?academicYearId=${academicYearId}`);
      this.setState({ groups: res.data, selectedGroup: null });
    } catch (error) {
      console.error("Error fetching groups:", error);
      this.setState({ groups: [], selectedGroup: null });
    }
  };

  fetchCourses = async (fbCategoryId) => {
    if (!fbCategoryId) {
      this.setState({ courses: [], selectedCourse: null });
      return;
    }
    try {
      const res = await api.get(`/auth7/courses?fbCategoryId=${fbCategoryId}`);
      this.setState({ courses: res.data, selectedCourse: null });
    } catch (error) {
      console.error("Error fetching courses:", error);
      this.setState({ courses: [], selectedCourse: null });
    }
  };

  fetchFConfig = async () => {
    const {
      selectedAcademicYear,
      selectedGroup,
      selectedFeedbackType,
      selectedFeedbackCategory,
      selectedCourse,
    } = this.state;

    if (
      !selectedAcademicYear ||
      !selectedGroup ||
      !selectedFeedbackType ||
      !selectedFeedbackCategory ||
      !selectedCourse
    ) {
      this.setState({
        autofilledYear: null,
        autofilledSemester: null,
        autofilledTerm: null,
        autofilledStaff: null,
      });
      return;
    }

    try {
      const res = await api.get("/auth7/fconfig", {
        params: {
          ayId: selectedAcademicYear.id,
          groupId: selectedGroup.id,
          fbTypeId: selectedFeedbackType.id,
          fbCategoryId: selectedFeedbackCategory.id,
          courseId: selectedCourse.id,
        },
      });
      const config = res.data;

      const { years, semesters, terms, staffs } = this.state;
      this.setState({
        autofilledYear: years.find((y) => y.id === config.YearId) || null,
        autofilledSemester: semesters.find((s) => s.id === config.SemId) || null,
        autofilledTerm: terms.find((t) => t.id === config.TermId) || null,
        autofilledStaff: staffs.find((s) => s.id === config.StaffId) || null,
      });
    } catch (error) {
      console.error("Error fetching f_config:", error);
      this.setState({
        autofilledYear: null,
        autofilledSemester: null,
        autofilledTerm: null,
        autofilledStaff: null,
      });
    }
  };

  fetchPendingStudents = async () => {
    this.setState({ isLoading: true });

    const {
      selectedAcademicYear,
      selectedGroup,
      selectedFeedbackType,
      selectedFeedbackCategory,
      selectedCourse,
      autofilledYear,
      autofilledSemester,
      autofilledTerm,
      autofilledStaff,
    } = this.state;

    const params = {
      academicYear: selectedAcademicYear?.id,
      group: selectedGroup?.id,
      fbType: selectedFeedbackType?.id,
      fbCategory: selectedFeedbackCategory?.id,
      course: selectedCourse?.id,
      year: autofilledYear?.id,
      semester: autofilledSemester?.id,
      term: autofilledTerm?.id,
      staff: autofilledStaff?.id,
    };

    try {
      const response = await api.get("/auth7/pending-students", { params });
      const students = response.data;

      // Group students by program
      const groupedByProgram = students.reduce((acc, student) => {
        const programName = student.programName || "Unknown Program";
        if (!acc[programName]) {
          acc[programName] = [];
        }
        acc[programName].push(student);
        return acc;
      }, {});

      this.setState({ pendingStudents: groupedByProgram });
    } catch (error) {
      console.error("Error fetching pending students:", error);
      alert("Error fetching pending students. Please try again.");
      this.setState({ pendingStudents: [] });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  downloadPDF = () => {
    const {
      selectedAcademicYear,
      selectedGroup,
      selectedFeedbackType,
      selectedFeedbackCategory,
      selectedCourse,
      autofilledYear,
      autofilledSemester,
      autofilledTerm,
      autofilledStaff,
      pendingStudents,
    } = this.state;

    if (Object.keys(pendingStudents).length === 0) {
      alert("No pending students data to download.");
      return;
    }

    const pdf = new jsPDF();
    let yPosition = 20;

    // pdf.addImage(logo, 'PNG', 15, 10, 30, 30);

    // Title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Student Pending List Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    // Generated date
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    pdf.text(`Generated on: ${currentDate} at ${currentTime}`, 105, yPosition, { align: "center" });
    yPosition += 20;

    // Selection Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Selection Details:", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const details = [
      { label: "Academic Year:", value: selectedAcademicYear?.name || "N/A" },
      { label: "Group:", value: selectedGroup?.code || "N/A" },
      { label: "Feedback Type:", value: selectedFeedbackType?.name || "N/A" },
      { label: "Feedback Category:", value: selectedFeedbackCategory?.name || "N/A" },
      { label: "Course:", value: selectedCourse ? `${selectedCourse.code} - ${selectedCourse.description}` : "N/A" },
      { label: "Year:", value: autofilledYear ? `${autofilledYear.code} - ${autofilledYear.description}` : "N/A" },
      { label: "Semester:", value: autofilledSemester ? `${autofilledSemester.code} - ${autofilledSemester.description}` : "N/A" },
      { label: "Term:", value: autofilledTerm?.name || "N/A" },
      { label: "Staff:", value: autofilledStaff ? `${autofilledStaff.StaffCode} - ${autofilledStaff.FirstName} ${autofilledStaff.LastName || ""}` : "N/A" }
    ];

    details.forEach((detail) => {
      pdf.text(`${detail.label} ${detail.value}`, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Students by Program
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Pending Students by Program:", 20, yPosition);
    yPosition += 10;

    let totalStudents = 0;

    Object.entries(pendingStudents).forEach(([programName, students], programIndex) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Program name
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${programName} (${students.length} students)`, 20, yPosition);
      yPosition += 8;

      // Prepare table data
      const tableData = students.map((student) => [
        student.uid,
        `${student.FirstName} ${student.LastName || ""}`,
        student.email || "N/A"
      ]);

      // Create table
      autoTable(pdf, {
        head: [["UID", "Name", "Email"]],
        body: tableData,
        startY: yPosition,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold"
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 80 }
        }
      });

      yPosition = pdf.lastAutoTable.finalY + 15;
      totalStudents += students.length;
    });

    // Summary
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary:", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Programs: ${Object.keys(pendingStudents).length}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total Pending Students: ${totalStudents}`, 20, yPosition);

    // Save the PDF
    const fileName = `Pending_Students_${selectedAcademicYear?.name || 'Report'}_${currentDate.replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);
  };

  handleAcademicYearChange = (event, newValue) => {
    this.setState({ selectedAcademicYear: newValue }, () => {
      this.fetchGroups(newValue ? newValue.id : null);
      this.fetchFConfig();
    });
  };

  handleGroupChange = (event, newValue) => {
    this.setState({ selectedGroup: newValue }, this.fetchFConfig);
  };

  handleFeedbackTypeChange = (event, newValue) => {
    this.setState({ selectedFeedbackType: newValue }, this.fetchFConfig);
  };

  handleFeedbackCategoryChange = (event, newValue) => {
    this.setState({ selectedFeedbackCategory: newValue }, () => {
      this.fetchCourses(newValue ? newValue.id : null);
      this.fetchFConfig();
    });
  };

  handleCourseChange = (event, newValue) => {
    this.setState({ selectedCourse: newValue }, this.fetchFConfig);
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.fetchPendingStudents();
    }
  };

  render() {
    const {
      academicYears,
      feedbackTypes,
      feedbackCategories,
      groups,
      courses,
      selectedAcademicYear,
      selectedGroup,
      selectedFeedbackType,
      selectedFeedbackCategory,
      selectedCourse,
      autofilledYear,
      autofilledSemester,
      autofilledTerm,
      autofilledStaff,
      pendingStudents,
      isLoading,
    } = this.state;

    const isButtonDisabled =
      isLoading ||
      !selectedAcademicYear ||
      !selectedGroup ||
      !selectedFeedbackType ||
      !selectedFeedbackCategory ||
      !selectedCourse ||
      !autofilledYear ||
      !autofilledSemester ||
      !autofilledTerm ||
      !autofilledStaff;

    const hasPendingStudents = Object.keys(pendingStudents).length > 0;

    return (
      <Container maxWidth="lg" onKeyPress={this.handleKeyPress}>
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          {/* Heading */}
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Student Pending List Generator
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          {/* Dropdown Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={academicYears}
                getOptionLabel={(option) => option.name}
                value={selectedAcademicYear}
                onChange={this.handleAcademicYearChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Academic Year"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={groups}
                getOptionLabel={(option) => option.code}
                value={selectedGroup}
                onChange={this.handleGroupChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={feedbackTypes}
                getOptionLabel={(option) => option.name}
                value={selectedFeedbackType}
                onChange={this.handleFeedbackTypeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Feedback Type"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={feedbackCategories}
                getOptionLabel={(option) => option.name}
                value={selectedFeedbackCategory}
                onChange={this.handleFeedbackCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Feedback Category"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={courses}
                getOptionLabel={(option) => `${option.code} - ${option.description}`}
                value={selectedCourse}
                onChange={this.handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Course"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Autofilled Fields Section */}
          {(autofilledYear || autofilledSemester || autofilledTerm || autofilledStaff) && (
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                Autofilled Fields
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Grid container spacing={3}>
                {autofilledYear && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">
                      <strong>Year:</strong> {`${autofilledYear.code} - ${autofilledYear.description}`}
                    </Typography>
                  </Grid>
                )}
                {autofilledSemester && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">
                      <strong>Semester:</strong> {`${autofilledSemester.code} - ${autofilledSemester.description}`}
                    </Typography>
                  </Grid>
                )}
                {autofilledTerm && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">
                      <strong>Term:</strong> {autofilledTerm.name}
                    </Typography>
                  </Grid>
                )}
                {autofilledStaff && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">
                      <strong>Staff:</strong> {`${autofilledStaff.StaffCode} - ${autofilledStaff.FirstName} ${autofilledStaff.LastName || ""}`}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Button and Loading Indicator */}
          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.fetchPendingStudents}
              disabled={isButtonDisabled}
              sx={{ paddingX: 4, paddingY: 1 }}
            >
              {isLoading ? "Fetching Pending List..." : "Display Pending List"}
            </Button>
            {hasPendingStudents && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={this.downloadPDF}
                sx={{ paddingX: 4, paddingY: 1 }}
              >
                Download PDF
              </Button>
            )}
            {isLoading && <CircularProgress size={24} />}
          </Box>

          {/* Pending Students List */}
          {hasPendingStudents && (
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pending Students by Program
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {Object.entries(pendingStudents).map(([programName, students]) => (
                <Box key={programName} sx={{ marginBottom: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {programName} ({students.length} students)
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>UID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.uid}>
                            <TableCell>{student.uid}</TableCell>
                            <TableCell>{`${student.FirstName} ${student.LastName || ""}`}</TableCell>
                            <TableCell>{student.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
              
              {/* Summary */}
              <Box sx={{ marginTop: 3, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body1">
                  <strong>Total Programs:</strong> {Object.keys(pendingStudents).length}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Pending Students:</strong> {Object.values(pendingStudents).reduce((total, students) => total + students.length, 0)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Footer Instructions */}
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, textAlign: "center" }}>
            Select the required fields and press "Display Pending List" to view students with pending feedback.
            {hasPendingStudents && " Click 'Download PDF' to export the report."}
          </Typography>
        </Paper>
      </Container>
    );
  }
}

export default PendingList;