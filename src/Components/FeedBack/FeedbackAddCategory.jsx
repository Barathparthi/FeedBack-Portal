import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import api from '../axiosInstance';

function AddCategory() {
  const navigate = useNavigate();
  const [newRecord, setNewRecord] = useState({ Sname: '', name: '' });

  const handleChange = (prop) => (event) => {
    setNewRecord({ ...newRecord, [prop]: event.target.value });
  };
  const handleAdd = async () => {
    try {
      await api.post(`/auth3/ccreated`, newRecord);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  const handleCancel = () => {
    navigate('/dashboard/fbcategory');
  };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }} 
    >
      <Grid item xs={3}>
        <Box sx={{ padding: 4, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Feedback Category
          </Typography>
          <TextField
            label="S.Name"
            fullWidth
            variant="outlined"
            value={newRecord.Sname}
            onChange={handleChange('Sname')}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            value={newRecord.name}
            onChange={handleChange('name')}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleAdd}
            sx={{ marginTop: 2 }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleCancel}
            sx={{ marginTop: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AddCategory;
