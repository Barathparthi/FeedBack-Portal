import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  FormControl, 
  MenuItem, 
  InputLabel, 
  Select, 
  TextField, 
  CircularProgress 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LightPurpleButton } from '../buttonStyles';
import api from '../axiosInstance';

const GroupUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    AcademicYear_id: '',
    program_id: '',
    Year_id: '',
    Sem_id: '',
    Term_id: '',
  });

  // Dropdown options
  const [academicYears, setAcademicYears] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data and group details
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [
        academicYearsRes,
        programsRes,
        termsRes,
        groupDetailsRes,
      ] = await Promise.all([
        api.get('/auth4/academic'),
        api.get('/auth4/programs'),
        api.get('/auth4/term'),
        api.get(`/auth4/group/${id}`),
      ]);

      setAcademicYears(academicYearsRes.data);
      setPrograms(programsRes.data);
      setTerms(termsRes.data);

      const groupData = groupDetailsRes.data;
      setFormData({
        code: groupData.code || '',
        description: groupData.description || '',
        AcademicYear_id: groupData.academic_year_id || '',
        program_id: groupData.program_id || '',
        Year_id: groupData.year_id || '',
        Sem_id: groupData.semester_id || '',
        Term_id: groupData.term_id || '',
      });

      // Fetch years if program is preselected
      if (groupData.program_id) {
        const yearsRes = await api.get(`/auth4/year/${groupData.program_id}`);
        setYears(yearsRes.data);
      }

      // Fetch semesters if year is preselected
      if (groupData.year_id) {
        const semestersRes = await api.get(`/auth4/semester/${groupData.year_id}`);
        setSemesters(semestersRes.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load group details. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/auth4/group/${id}`, formData); // Update the group using the API
      navigate('/groups'); // Redirect after successful update
    } catch (error) {
      console.error('Error updating group:', error);
      setError('Failed to update group. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  

  // Fetch years when program changes
  const handleProgramChange = async (event) => {
    const programId = event.target.value;

    try {
      setFormData((prev) => ({
        ...prev,
        program_id: programId,
        Year_id: '',
        Sem_id: '',
      }));

      if (programId) {
        const yearsRes = await api.get(`/auth4/year/${programId}`);
        setYears(yearsRes.data);
      } else {
        setYears([]);
        setSemesters([]);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      setError('Failed to load years. Please try again.');
    }
  };

  // Fetch semesters when year changes
  const handleYearChange = async (event) => {
    const yearId = event.target.value;

    try {
      setFormData((prev) => ({
        ...prev,
        Year_id: yearId,
        Sem_id: '',
      }));

      if (yearId) {
        const semestersRes = await api.get(`/auth4/semester/${yearId}`);
        setSemesters(semestersRes.data);
      } else {
        setSemesters([]);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
      setError('Failed to load semesters. Please try again.');
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [id]);

  // Render loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'red'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div className="px-5 mt-3">
      <h3 style={{ color: "red" }}>Edit Group</h3>
      
      <Box 
        component="form" 
        noValidate 
        onSubmit={handleSubmit} 
        sx={{ mt: 1, width: "100%" }} 
        style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px'}}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Group Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Academic Year Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select
                name="AcademicYear_id"
                value={formData.AcademicYear_id}
                label="Academic Year"
                onChange={handleChange}
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

          {/* Program Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Program</InputLabel>
              <Select
                name="program_id"
                value={formData.program_id}
                label="Program"
                onChange={(e) => {
                  handleChange(e);
                  handleProgramChange(e);
                }}
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

          {/* Year Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                name="Year_id"
                value={formData.Year_id}
                label="Year"
                disabled={!formData.program_id}
                onChange={(e) => {
                  handleChange(e);
                  handleYearChange(e);
                }}
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

          {/* Semester Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                name="Sem_id"
                value={formData.Sem_id}
                label="Semester"
                disabled={!formData.Year_id}
                onChange={handleChange}
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

          {/* Term Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Term</InputLabel>
              <Select
                name="Term_id"
                value={formData.Term_id}
                label="Term"
                onChange={handleChange}
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

        {/* Submit Button */}
        <div className="d-flex gap-2 mt-3">
          <LightPurpleButton
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Update Group"}
          </LightPurpleButton>
        </div>
      </Box>
    </div>
  );
};

export default GroupUpdate;