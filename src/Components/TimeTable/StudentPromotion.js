import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Tooltip,
  TextField,
  Paper,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from 'framer-motion';
import api from "../axiosInstance";

// Styled components for enhanced aesthetics
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1.5, 4),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  borderRadius: "8px",
  overflow: "hidden",
  "& .MuiTableCell-head": {
    // backgroundColor: "#1976d2",
    color: "Black",
    fontWeight: 600,
  },
  "& .MuiTableRow-root:hover": {
    backgroundColor: "#f5f5f5",
    transition: "background-color 0.3s",
  },
}));

const StudentPromotion = () => {
  const [degree, setDegrees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [years, setYears] = useState([]);
  const [sems, setSems] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const clearMessages = () => setAlert("");

  useEffect(() => {
    api.get(`/auth4/degree`).then((response) => setDegrees(response.data));
  }, []);

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgram(programId);
    api.get(`/auth4/batches/${programId}`).then((response) => setBatches(response.data));
  };

  const handleDegreeChange = (e) => {
    const degreeId = e.target.value;
    setSelectedDegree(degreeId);
    api
      .get(`/auth4/programs/${degreeId}`)
      .then((response) => setPrograms(response.data))
      .catch(() => {
        setAlert("Failed to fetch programs.");
        setTimeout(clearMessages, 5000);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedBatch) {
      setAlert("Please fill all the FROM fields to view students.");
      setTimeout(clearMessages, 5000);
      return;
    }
    setLoader(true);
    api
      .get(`/auth4/students?program=${selectedProgram}&batch=${selectedBatch}`)
      .then((response) => {
        setStudents(response.data);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setAlert("Failed to fetch student data.");
        setTimeout(clearMessages, 5000);
      });
  };

  const handleRegisterClick = () => {
    if (!selectedYear || !selectedSem || !selectedTerm) {
      setAlert("Please fill all the TO fields before registering.");
      setTimeout(clearMessages, 5000);
      return;
    }
    const updateData = {
      studentIds: selectedStudents,
      yearId: selectedYear,
      semId: selectedSem,
      termId: selectedTerm,
    };
    setLoader(true);
    api
      .post(`/auth4/update-students`, updateData)
      .then(() => {
        setLoader(false);
        setAlert("Student data updated successfully!");
        setTimeout(clearMessages, 5000);
      })
      .catch(() => {
        setLoader(false);
        setAlert("Failed to update student data.");
        setTimeout(clearMessages, 5000);
      });
  };

  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((s) => s.id));
      setIsAllSelected(true);
    } else {
      setSelectedStudents([]);
      setIsAllSelected(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  useEffect(() => {
    if (selectedDegree) {
      api.get(`/auth4/years/${selectedDegree}`).then((response) => {
        setYears(response.data);
        setSelectedYear("");
        setSems([]);
        setSelectedSem("");
      });
    }
  }, [selectedDegree]);

  useEffect(() => {
    if (selectedYear) {
      api.get(`/auth4/sems`, { params: { yearId: selectedYear } }).then((response) => {
        setSems(response.data);
        setSelectedSem("");
      });
    }
  }, [selectedYear]);

  useEffect(() => {
    api.get(`/auth4/terms`).then((response) => setTerms(response.data));
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ px: 5, py: 3, maxWidth: "1400px", margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
      <Fade in timeout={600}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2", mb: 4 }}
        >
          Student Promotion
        </Typography>
      </Fade>

      <StyledPaper elevation={3}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: "#424242" }}>
          From:
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Degree</InputLabel>
                <Select
                  value={selectedDegree}
                  label="Degree"
                  onChange={handleDegreeChange}
                  sx={{ borderRadius: "8px" }}
                >
                  {degree.map((deg) => (
                    <MenuItem key={deg.id} value={deg.id}>
                      {deg.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Program</InputLabel>
                <Select
                  value={selectedProgram}
                  label="Program"
                  onChange={handleProgramChange}
                  sx={{ borderRadius: "8px" }}
                >
                  {programs.map((prog) => (
                    <MenuItem key={prog.id} value={prog.id}>
                      {prog.code} - {prog.Sname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={selectedBatch}
                  label="Batch"
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  sx={{ borderRadius: "8px" }}
                >
                  {batches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      {batch.Bcode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Search Student"
                placeholder="Search by UniqueID or Name"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <StyledButton type="submit" variant="contained" color="primary">
              {loader ? <CircularProgress size={24} color="inherit" /> : "View Students"}
            </StyledButton>
          </Box>
          {alert && (
            <Fade in timeout={300}>
              <Alert severity="info" sx={{ mt: 2 }}>
                {alert}
              </Alert>
            </Fade>
          )}
        </Box>
      </StyledPaper>

      {students.length > 0 && (
        <StyledPaper sx={{ mt: 4 }}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedStudents.length > 0 && !isAllSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAllStudents}
                  />
                </TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Sem</TableCell>
                <TableCell>Term</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>{student.uid}</TableCell>
                  <TableCell>{student.FirstName}</TableCell>
                  <TableCell>{student.YearDescription}</TableCell>
                  <TableCell>{student.SemDescription}</TableCell>
                  <TableCell>{student.TermDescription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledPaper>
      )}

      {selectedStudents.length > 0 && (
        <StyledPaper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: "#424242" }}>
            To:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedDegree}
                  sx={{ borderRadius: "8px" }}
                >
                  {years.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Sem</InputLabel>
                <Select
                  value={selectedSem}
                  label="Sem"
                  onChange={(e) => setSelectedSem(e.target.value)}
                  disabled={!selectedYear}
                  sx={{ borderRadius: "8px" }}
                >
                  {sems.map((sem) => (
                    <MenuItem key={sem.id} value={sem.id}>
                      {sem.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Term</InputLabel>
                <Select
                  value={selectedTerm}
                  label="Term"
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  sx={{ borderRadius: "8px" }}
                >
                  {terms.map((term) => (
                    <MenuItem key={term.id} value={term.id}>
                      {term.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
                Sem 1 = 1 | T1 = 2 | T2 = 3 | T3 = 4 | T4 = 5
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <StyledButton variant="contained" color="primary" onClick={handleRegisterClick}>
              {loader ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </StyledButton>
          </Box>
          {alert && (
            <Fade in timeout={300}>
              <Alert severity="info" sx={{ mt: 2 }}>
                {alert}
              </Alert>
            </Fade>
          )}
        </StyledPaper>
      )}
      </motion.div>
    </Box>
  );
};

export default StudentPromotion;


// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Box,
//   FormControl,
//   MenuItem,
//   InputLabel,
//   Select,
//   Checkbox,
//   Button,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
//   Alert,
//   TextField,
//   Paper,
//   Fade,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { motion } from "framer-motion";
// import api from "../axiosInstance";

// // Styled components for compact design
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2), // Reduced padding
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
//   background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: "6px",
//   padding: theme.spacing(1, 3), // Smaller padding
//   textTransform: "none",
//   fontWeight: 600,
//   boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
//   transition: "transform 0.2s ease-in-out",
//   "&:hover": {
//     transform: "translateY(-1px)",
//   },
// }));

// const StyledTable = styled(Table)(({ theme }) => ({
//   borderRadius: "6px",
//   overflow: "hidden",
//   "& .MuiTableCell-head": {
//     color: "black",
//     fontWeight: 600,
//     padding: theme.spacing(1), // Reduced padding
//     fontSize: "0.9rem", // Smaller font for compactness
//   },
//   "& .MuiTableCell-body": {
//     padding: theme.spacing(1), // Reduced padding
//     fontSize: "0.85rem",
//   },
//   "& .MuiTableRow-root:hover": {
//     backgroundColor: "#f5f5f5",
//     transition: "background-color 0.3s",
//   },
// }));

// const StudentPromotion = () => {
//   const [degree, setDegrees] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedDegree, setSelectedDegree] = useState("");
//   const [selectedProgram, setSelectedProgram] = useState("");
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedSem, setSelectedSem] = useState("");
//   const [selectedTerm, setSelectedTerm] = useState("");
//   const [years, setYears] = useState([]);
//   const [sems, setSems] = useState([]);
//   const [terms, setTerms] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [alert, setAlert] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   const clearMessages = () => setAlert("");

//   useEffect(() => {
//     api.get(`/auth4/degree`).then((response) => setDegrees(response.data));
//   }, []);

//   const handleProgramChange = (e) => {
//     const programId = e.target.value;
//     setSelectedProgram(programId);
//     api.get(`/auth4/batches/${programId}`).then((response) => setBatches(response.data));
//   };

//   const handleDegreeChange = (e) => {
//     const degreeId = e.target.value;
//     setSelectedDegree(degreeId);
//     api
//       .get(`/auth4/programs/${degreeId}`)
//       .then((response) => setPrograms(response.data))
//       .catch(() => {
//         setAlert("Failed to fetch programs.");
//         setTimeout(clearMessages, 5000);
//       });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProgram || !selectedBatch) {
//       setAlert("Please fill all fields to view students.");
//       setTimeout(clearMessages, 5000);
//       return;
//     }
//     setLoader(true);
//     api
//       .get(`/auth4/students?program=${selectedProgram}&batch=${selectedBatch}`)
//       .then((response) => {
//         setStudents(response.data);
//         setLoader(false);
//       })
//       .catch(() => {
//         setLoader(false);
//         setAlert("Failed to fetch students.");
//         setTimeout(clearMessages, 5000);
//       });
//   };

//   const handleRegisterClick = () => {
//     if (!selectedYear || !selectedSem || !selectedTerm) {
//       setAlert("Please fill all fields to register.");
//       setTimeout(clearMessages, 5000);
//       return;
//     }
//     const updateData = {
//       studentIds: selectedStudents,
//       yearId: selectedYear,
//       semId: selectedSem,
//       termId: selectedTerm,
//     };
//     setLoader(true);
//     api
//       .post(`/auth4/update-students`, updateData)
//       .then(() => {
//         setLoader(false);
//         setAlert("Students updated successfully!");
//         setTimeout(clearMessages, 5000);
//       })
//       .catch(() => {
//         setLoader(false);
//         setAlert("Failed to update students.");
//         setTimeout(clearMessages, 5000);
//       });
//   };

//   const handleSelectAllStudents = (e) => {
//     if (e.target.checked) {
//       setSelectedStudents(students.map((s) => s.id));
//       setIsAllSelected(true);
//     } else {
//       setSelectedStudents([]);
//       setIsAllSelected(false);
//     }
//   };

//   const handleSelectStudent = (studentId) => {
//     setSelectedStudents((prev) =>
//       prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
//     );
//   };

//   useEffect(() => {
//     if (selectedDegree) {
//       api.get(`/auth4/years/${selectedDegree}`).then((response) => {
//         setYears(response.data);
//         setSelectedYear("");
//         setSems([]);
//         setSelectedSem("");
//       });
//     }
//   }, [selectedDegree]);

//   useEffect(() => {
//     if (selectedYear) {
//       api.get(`/auth4/sems`, { params: { yearId: selectedYear } }).then((response) => {
//         setSems(response.data);
//         setSelectedSem("");
//       });
//     }
//   }, [selectedYear]);

//   useEffect(() => {
//     api.get(`/auth4/terms`).then((response) => setTerms(response.data));
//   }, []);

//   const filteredStudents = students.filter(
//     (student) =>
//       student.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       student.uid.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, maxWidth: "100%", margin: "0 auto" }}>
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         <Fade in timeout={600}>
//           <Typography
//             variant="h5" // Reduced from h4 for compactness
//             align="center"
//             gutterBottom
//             sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}
//           >
//             Student Promotion
//           </Typography>
//         </Fade>

//         <StyledPaper elevation={3}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: "#424242" }}>
//             From:
//           </Typography>
//           <Box component="form" noValidate onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={3}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Degree</InputLabel>
//                   <Select
//                     value={selectedDegree}
//                     label="Degree"
//                     onChange={handleDegreeChange}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {degree.map((deg) => (
//                       <MenuItem key={deg.id} value={deg.id}>
//                         {deg.code}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Program</InputLabel>
//                   <Select
//                     value={selectedProgram}
//                     label="Program"
//                     onChange={handleProgramChange}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {programs.map((prog) => (
//                       <MenuItem key={prog.id} value={prog.id}>
//                         {prog.code} - {prog.Sname}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Batch</InputLabel>
//                   <Select
//                     value={selectedBatch}
//                     label="Batch"
//                     onChange={(e) => setSelectedBatch(e.target.value)}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {batches.map((batch) => (
//                       <MenuItem key={batch.id} value={batch.id}>
//                         {batch.Bcode}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <TextField
//                   label="Search"
//                   placeholder="ID or Name"
//                   variant="outlined"
//                   fullWidth
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: "0.9rem" } }}
//                 />
//               </Grid>
//             </Grid>
//             <Box sx={{ mt: 2, textAlign: "right" }}>
//               <StyledButton type="submit" variant="contained" color="primary">
//                 {loader ? <CircularProgress size={20} color="inherit" /> : "View"}
//               </StyledButton>
//             </Box>
//             {alert && (
//               <Fade in timeout={300}>
//                 <Alert severity="info" sx={{ mt: 1, fontSize: "0.85rem" }}>
//                   {alert}
//                 </Alert>
//               </Fade>
//             )}
//           </Box>
//         </StyledPaper>

//         {students.length > 0 && (
//           <StyledPaper sx={{ mt: 2 }}>
//             <StyledTable>
//               <TableHead>
//                 <TableRow>
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       color="primary"
//                       indeterminate={selectedStudents.length > 0 && !isAllSelected}
//                       checked={isAllSelected}
//                       onChange={handleSelectAllStudents}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Year</TableCell>
//                   <TableCell>Sem</TableCell>
//                   <TableCell>Term</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredStudents.map((student) => (
//                   <TableRow key={student.id}>
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         color="primary"
//                         checked={selectedStudents.includes(student.id)}
//                         onChange={() => handleSelectStudent(student.id)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>{student.uid}</TableCell>
//                     <TableCell>{student.FirstName}</TableCell>
//                     <TableCell>{student.YearDescription}</TableCell>
//                     <TableCell>{student.SemDescription}</TableCell>
//                     <TableCell>{student.TermDescription}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </StyledTable>
//           </StyledPaper>
//         )}

//         {selectedStudents.length > 0 && (
//           <StyledPaper sx={{ mt: 2 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: "#424242" }}>
//               To:
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={4}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Year</InputLabel>
//                   <Select
//                     value={selectedYear}
//                     label="Year"
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     disabled={!selectedDegree}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {years.map((year) => (
//                       <MenuItem key={year.id} value={year.id}>
//                         {year.description}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={4}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Sem</InputLabel>
//                   <Select
//                     value={selectedSem}
//                     label="Sem"
//                     onChange={(e) => setSelectedSem(e.target.value)}
//                     disabled={!selectedYear}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {sems.map((sem) => (
//                       <MenuItem key={sem.id} value={sem.id}>
//                         {sem.description}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={4}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Term</InputLabel>
//                   <Select
//                     value={selectedTerm}
//                     label="Term"
//                     onChange={(e) => setSelectedTerm(e.target.value)}
//                     sx={{ borderRadius: "6px", fontSize: "0.9rem" }}
//                   >
//                     {terms.map((term) => (
//                       <MenuItem key={term.id} value={term.id}>
//                         {term.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <Typography variant="caption" sx={{ mt: 0.5, color: "text.secondary", fontSize: "0.75rem" }}>
//                   S1=1 | T1=2 | T2=3 | T3=4 | T4=5
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Box sx={{ mt: 2, textAlign: "right" }}>
//               <StyledButton variant="contained" color="primary" onClick={handleRegisterClick}>
//                 {loader ? <CircularProgress size={20} color="inherit" /> : "Register"}
//               </StyledButton>
//             </Box>
//             {alert && (
//               <Fade in timeout={300}>
//                 <Alert severity="info" sx={{ mt: 1, fontSize: "0.85rem" }}>
//                   {alert}
//                 </Alert>
//               </Fade>
//             )}
//           </StyledPaper>
//         )}
//       </motion.div>
//     </Box>
//   );
// };

// export default StudentPromotion;