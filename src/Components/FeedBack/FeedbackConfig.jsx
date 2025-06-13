import React, { useEffect, useState } from "react";
import axios from "axios";
import {TextField, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, Box, TableCell, TableContainer, TableHead,
  TableRow, Paper, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete} from "@mui/material";
import api from "../axiosInstance";

const FeedbackConfigForm = () => {
  const [formData, setFormData] = useState({ 
    academicYear: "",
    group: "",
    program: "",
    year: "",
    term: "",
    semester: "",
    course: "",
    staff: "",
    fbType: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [academicYearData, setAcademicYearData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [fbTypes, setFbTypes] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [semData, setSemData] = useState([]);
  const [termData, setTermData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [pageSize, setPageSize] = useState(10);
  const [exampleForm, setExampleform] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [ratingTypes, setRatingTypes] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [editMode, setEditMode] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [fbTypeData, setFbTypeData] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false);

  const getCategoryName = (id) => {
    const category = categoryData.find((category) => category.id === id);
    return category ? category.name : "N/A";
  };

  const getCourseName = (id) => {
    const course = courses.find((course) => course.id === id);
    return course ? course.description : "N/A";
  };
  
  const getYearName = (id) => {
    const year = yearData.find((year) => year.id === id);
    return year ? year.description : "N/A";
  };

  const getSemName = (id) => {
    const sem = semData.find((sem) => sem.id === id);
    return sem ? sem.description : "N/A";
  };

  const getGroupName = (id) => {
    const group = groupData.find((groups) => groups.id === id);
    return group ? group.description : "N/A";
  };
  
  const getStaffName = (id) => {
    const staff = staffMembers.find((staff) => staff.id === id);
    return staff ? `${staff.FirstName} ${staff.LastName}` : "N/A";
  };

  const getAcademicYearName = (id) => {
    const academicYear = academicYearData.find((year) => year.id === id);
    return academicYear ? academicYear.name : "N/A";
  };
  
  const getTermName = (id) => {
    const term = termData.find((term) => term.id === id);
    return term ? term.name : "N/A";
  };
  
  const getFbTypeName = (id) => {
    const fbType = fbTypes.find(() => id === id);
    return fbType ? fbType.name : "N/A";
  };

  const fetchData = (endpoint, setter) => {
    api.get(`/auth3/${endpoint}`)
      .then((res) => {
        const data = res.data;
        setter(data);
      })
      .catch((err) => {
        console.error(`Error fetching ${endpoint}:`, err);
      });
  };

  useEffect(() => {
    fetchData("academicyear", setAcademicYearData);
    fetchData("year", setYearData);
    fetchData("semester", setSemData);
    fetchData("term", setTermData);
    fetchData("course", setCourses);
    fetchData("staff", setStaffMembers);
    fetchData("groups", setGroups);
    fetchData("", setFbTypes);
    fetchData("category", setCategoryData);
    fetchData("degree", setDegreeData);
  }, []);

  useEffect(() => {
    const fetchDropdownData = () => {
      api.get("/auth3")
        .then((fbTypeRes) => {
          setFbTypes(fbTypeRes.data);
          return api.get("/auth3/category");
        })
        .then((categoryRes) => {
          setCategoryData(categoryRes.data);
        })
        .catch((error) => {
          console.error("Error fetching dropdown data:", error);
        });
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchDropdownData = () => {
      api.get("/auth3/academicyear")
        .then((academicYearRes) => {
          setAcademicYearData(academicYearRes.data);
        })
        .catch((error) => {
          console.error("Error fetching dropdown data:", error);
        });
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchGroups = () => {
      if (!formData.academicYear) return;
      
      api.get(`/auth3/groups/${formData.academicYear}`)
        .then((groupRes) => {
          console.log("Fetched Groups:", groupRes.data);
          setGroupData(groupRes.data);
        })
        .catch((error) => {
          console.error("Error fetching groups:", error);
        });
    };
    fetchGroups();
  }, [formData.academicYear]);

  const handleAutocompleteChange = (event, value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || null,
    }));
  };

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    api.get(`/auth3/group-details/${groupId}`)
      .then((res) => {
        const groupDetails = res.data;
        console.log(groupDetails);

        setFormData((prev) => ({
          ...prev,
          group: groupId,
          groupId: groupDetails.group_id || "",
          program: `${groupDetails.program_code} - ${groupDetails.program_name}` || "",
          programId: groupDetails.program_id || "",
          year: `${groupDetails.year_code} - ${groupDetails.year_name}` || "",
          yearId: groupDetails.year_id || "",
          term: `${groupDetails.term_code} - ${groupDetails.term_name}` || "",
          termId: groupDetails.term_id || "",
          semester: `${groupDetails.sem_code}` || "",
          semId: groupDetails.sem_id || "",
        }));
      })
      .catch((err) => {
        console.error("Error fetching group details:", err);
      });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClick = () => {
    api.get("/auth3/feedbackconfig")
      .then((response) => {
        const data = response.data;
        setFetchedData(data);
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching feedback config data:", error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const submissionData = {
      AyId: formData.academicYear,
      YearId: formData.yearId,
      SemId: formData.semId,
      TermId: formData.termId,
      CourseId: formData.course?.id,
      StaffId: formData.staff?.id,
      GroupId: formData.group,
      FbtypeId: formData.fbType,
      FbCategoryId: formData.category,
      Sdate: formData.startDate,
      Edate: formData.endDate,
    };

    api.post("/auth3/afeedbackconfig", submissionData)
      .then((res) => {
        if (res.status === 201) {
          alert("Feedback configuration added successfully!");
          setFormData({
            academicYear: "",
            groupId: "",
            program: "",
            yearId: "",
            term: "",
            semester: "",
            course: null,
            staff: null,
            fbType: "",
            category: "",
            startDate: "",
            endDate: "",
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error("Server response:", error.response.data);
          alert(`Error: ${error.response.data.message}`);
        } else {
          console.error("Unknown error:", error);
          alert("An unknown error occurred while submitting the form.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      api.delete(`/auth3/afeedbackconfigdelete/${id}`)
        .then(() => {
          setFetchedData((prevData) => prevData.filter((item) => item.Id !== id));
          alert("Record deleted successfully!");
          handleViewClick();
        })
        .catch((error) => {
          console.error("Failed to delete record:", error);
          alert("Failed to delete record.");
        });
    }
  };

  return (
    <Grid container justifyContent="center" spacing={3} sx={{ mt: -1 }}>
      <Grid item xs={12} md={8} lg={6}>
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
            Feedback Configuration Form
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => {
                    handleFieldChange(e);
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Academic Year
                  </MenuItem>
                  {academicYearData.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  name="group"
                  value={formData.group}
                  onChange={handleGroupChange}
                >
                  <MenuItem value="" disabled>
                    Select Group
                  </MenuItem>
                  {groupData.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {["program", "year", "term", "semester"].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField fullWidth label={field} value={formData[field]} disabled />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={courses}
                value={formData.course}
                getOptionLabel={(option) =>
                  option ? `${option.code} - ${option.description}` : ""
                }
                onChange={(e, value) =>
                  handleAutocompleteChange(e, value, "course")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Course" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={staffMembers}
                value={formData.staff}
                getOptionLabel={(option) =>
                  option ? `${option.StaffCode} - ${option.FirstName}` : ""
                }
                onChange={(e, value) =>
                  handleAutocompleteChange(e, value, "staff")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Staff" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Feedback Type</InputLabel>
                <Select name="fbType" value={formData.fbType} onChange={handleFieldChange}>
                  {fbTypes.map((fbType) => (
                    <MenuItem key={fbType.id} value={fbType.id}>
                      {fbType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleFieldChange}>
                  {categoryData.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {["startDate", "endDate"].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  type="date"
                  label={field === "startDate" ? "Start Date" : "End Date"}
                  name={field}
                  value={formData[field]}
                  onChange={handleFieldChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleFormSubmit}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleViewClick}>
                View Data
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            sx={{
              "& .MuiDialog-paper": {
                width: "80%",
                maxWidth: "100%",
                height: "80%",
                maxHeight: "90%",
              },
            }}
          >
            <DialogTitle>Feedback Configuration Data</DialogTitle>
            <DialogContent>
              {fetchedData.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Academic Year</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>Term</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Staff</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Feedback Type</TableCell>
                      <TableCell>Feedback Category</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{getAcademicYearName(row.AyId)}</TableCell>
                        <TableCell>{getYearName(row.YearId)}</TableCell>
                        <TableCell>{getSemName(row.SemId)}</TableCell>
                        <TableCell>{getTermName(row.TermId)}</TableCell>
                        <TableCell>{getCourseName(row.CourseId)}</TableCell>
                        <TableCell>{getStaffName(row.StaffId)}</TableCell>
                        <TableCell>{getGroupName(row.GroupId)}</TableCell>
                        <TableCell>{getFbTypeName(row.FbTypeId)}</TableCell>
                        <TableCell>{getCategoryName(row.FbCategoryId)}</TableCell>
                        <TableCell>{row.Sdate}</TableCell>
                        <TableCell>{row.Edate}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No data available</Typography>
              )}
            </DialogContent>
          </Dialog>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FeedbackConfigForm;