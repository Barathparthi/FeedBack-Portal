import React from "react";
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
} from "@mui/material";
import api from "../axiosInstance";
import { Link, useNavigate } from "react-router-dom";

class FeedbackReportGenerator extends React.Component {

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

  generateDetailedReport = async () => {
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

    let endpoint = "/auth7/generate-detailed-report";
    if (selectedFeedbackCategory?.id === 2) {
      endpoint = "/auth7/generate-detailed-report/lab";
    } else if (selectedFeedbackCategory?.id === 3) {
      endpoint = "/auth7/generate-detailed-report/skill";
    }

    try {
      const response = await api.post(endpoint, params, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "feedback_report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("Report downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading report. Please try again.");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.generateDetailedReport();
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

    return (
      <Container maxWidth="lg" onKeyPress={this.handleKeyPress}>
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          {/* Heading */}
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Detailed Feedback Report Generator
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
          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.generateDetailedReport}
              disabled={isButtonDisabled}
              sx={{ paddingX: 4, paddingY: 1 }}
            >
              {isLoading ? "Generating Report..." : "Generate Detailed Report"}
            </Button>
            {isLoading && <CircularProgress size={24} sx={{ marginLeft: 2 }} />}
          </Box>
          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Link to="/dashboard/pending-list" className="btn btn-success">
          Pending List
        </Link>
        </Box>

          {/* Footer Instructions */}
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, textAlign: "center" }}>
            Select the required fields and press "Generate Detailed Report" to download the feedback report.
          </Typography>
        </Paper>
      </Container>
    );
  }
}

export default FeedbackReportGenerator;