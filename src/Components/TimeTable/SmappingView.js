import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  Button,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import api from '../axiosInstance';

// Custom styled components
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  borderRadius: 25,
  padding: '10px 20px',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const SmappingView = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [existingMappings, setExistingMappings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/auth4/academic')
      .then((response) => setAcademicYears(response.data))
      .catch((error) => console.error('Error fetching Academic Years:', error));
    api
      .get('/auth4/programs')
      .then((response) => setPrograms(response.data))
      .catch((error) => console.error('Error fetching Programs:', error));
  }, []);

  useEffect(() => {
    if (selectedAcademicYear) {
      api
        .get(`/auth4/groups/${selectedAcademicYear}`)
        .then((response) => setGroups(response.data))
        .catch((error) => console.error('Error fetching Groups:', error));
    }
  }, [selectedAcademicYear]);

  useEffect(() => {
    if (selectedProgram) {
      api
        .get(`/auth4/batch/${selectedProgram}`)
        .then((response) => setBatches(response.data))
        .catch((error) => console.error('Error fetching Batches:', error));
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgram && selectedBatch) {
      fetchFilteredStudents();
    }
  }, [selectedProgram, selectedBatch]);

  const fetchFilteredStudents = () => {
    setLoading(true);
    api
      .get('/auth4/student', {
        params: {
          programId: selectedProgram || null,
          batchId: selectedBatch || null,
        },
      })
      .then((response) => {
        setStudents(response.data);
        setSelectedStudents([]);
        fetchExistingMappings();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching filtered students:', error);
        setLoading(false);
      });
  };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
  };

  const fetchExistingMappings = () => {
    if (selectedAcademicYear && selectedGroup) {
      api
        .get('/auth4/mappings', {
          params: {
            academicYearId: selectedAcademicYear,
            groupId: selectedGroup.id,
          },
        })
        .then((response) => {
          const studentIds = response.data;
          setExistingMappings(studentIds);
          setSelectedStudents(studentIds);
        })
        .catch((error) => {
          console.error('Error fetching existing mappings:', error);
        });
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const isAllSelected =
    students.length > 0 &&
    students.every(({ id }) => selectedStudents.includes(id));

  const handleSelectAllStudents = (event) => {
    if (event.target.checked) {
      setSelectedStudents(students.map(({ id }) => id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleRegister = () => {
    if (selectedStudents.length === 0) {
      alert('Please select students to register.');
      return;
    }
    setLoading(true);
    api
      .post('/auth4/astudents', {
        selectedAcademicYearId: selectedAcademicYear,
        selectedGroupId: selectedGroup.id,
        selectedStudentId: selectedStudents,
      })
      .then((response) => {
        alert('Students registered successfully!');
        fetchExistingMappings();
        setLoading(false);
        setSelectedStudents([]);
      })
      .catch((error) => {
        console.error('Error registering students:', error);
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: 'Red', fontWeight: 'bold', mb: 4 }}
          >
            Student Mapping
          </Typography>

          <Paper
            sx={{
              p: 4,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="academic-year-label">Academic Year</InputLabel>
                  <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={selectedAcademicYear}
                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                    label="Academic Year"
                    sx={{ borderRadius: '8px' }}
                  >
                    {academicYears.map((academic) => (
                      <MenuItem key={academic.id} value={academic.id}>
                        {academic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" required>
                  <Autocomplete
                    id="group"
                    disablePortal
                    options={groups}
                    getOptionLabel={(option) =>
                      `${option.code || ''}${option.code && option.description ? ' - ' : ''}${
                        option.description || ''
                      }`
                    }
                    value={selectedGroup}
                    onChange={(event, newValue) => {
                      setSelectedGroup(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Group Code"
                        placeholder="Search Group code..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="program-label">Program</InputLabel>
                  <Select
                    labelId="program-label"
                    id="program"
                    value={selectedProgram}
                    onChange={handleProgramChange}
                    label="Program"
                    sx={{ borderRadius: '8px' }}
                  >
                    {programs.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.code} - {program.Sname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="batch-label">Batch</InputLabel>
                  <Select
                    labelId="batch-label"
                    id="batch"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    label="Batch"
                    sx={{ borderRadius: '8px' }}
                  >
                    {batches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.Bcode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ mt: 4 }}>
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <StyledTableRow key={student.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleSelectStudent(student.id)}
                          />
                        </TableCell>
                        <TableCell>{student.uid}</TableCell>
                        <TableCell>{student.FirstName}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </Box>
            )}

            {selectedStudents.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <GradientButton onClick={handleRegister} disabled={loading}>
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
                </GradientButton>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SmappingView;
