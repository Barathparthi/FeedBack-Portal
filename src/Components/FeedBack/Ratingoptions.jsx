import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { checkPermissions } from '../Helper/RolePermission';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import api from "../axiosInstance";
const RatingOptions = () => {
  const [formData, setFormData] = useState({
    sname: "",
    description: "",
    ratingValue: "",
    fbratingId: "", 
  });
  const navigate = useNavigate();
  const { page = 2} = useParams(); 
  const [ratingOptions, setRatingOptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [ratingTypes,setRatingTypes] = useState([]);
  const [rating , setRating] = useState([]);     
  const [isEditing, setIsEditing] = useState(false);  
  const [newRecord, setNewRecord] = useState({ type: '' }); 
  const [editRecordId, setEditRecordId] = useState(null); 
  const [pageSize, setPageSize] = useState(10);       
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page, 10) : 3);
  const [totalPages, setTotalPages] = useState(null);
  const [isloading, setIsLoading] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);  
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);
  const fetchRatingOptions = async () => {
    try {
      const response = await api.get(`/auth3/rating-options`);
      const mappedData = response.data.map((option) => ({
        id: option.id,
        sname: option.Sname,
        description: option.description,
        rating_value: option.Rvalue,
        fbratingId: Number(option.fbratingId), 
      }));
      setRatingOptions(mappedData);
    } catch (error) {
      console.error("Error fetching rating options:", error);
      setMessage(
        error.response
          ? error.response.data.message || "Error fetching rating options."
          : "Error fetching rating options."
      );
      setOpenSnackbar(true);
    }
  };
  const fetchRatingTypes = async () => {
    try {
      const response = await api.get(`/auth3/rating`);
      setRatingTypes(response.data);
    } catch (error) {
      console.error("Error fetching rating types:", error);
      setMessage(
        error.response
          ? error.response.data.message || "Error fetching rating types."
          : "Error fetching rating types."
      );
      setOpenSnackbar(true);
    }
  };
  useEffect(() => {
    fetchRatingOptions();
    fetchRatingTypes();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: name === "fbratingId" ? Number(value) : value });
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (isEdit) {
          await api.put(`/auth3/rrating-options/${editId}`, {
            sname: formData.sname,
            description: formData.description,
            ratingValue: formData.ratingValue,
            fbratingId: formData.fbratingId,
          });
          setRatingOptions((prev) =>
            prev.map((option) =>
              option.id === editId
                ? { ...option, ...formData, rating_value: formData.ratingValue }
                : option
            )
          );
          setMessage("Rating option updated successfully!");
        } else {
          const response = await api.post(`/auth3/arating-options`, {
            sname: formData.sname,
            description: formData.description,
            ratingValue: formData.ratingValue,
            ratingType: formData.fbratingId,
          });
          const newOption = {
            id: response.data.id, 
            sname: formData.sname,
            description: formData.description,
            rating_value: formData.ratingValue,
            fbratingId: formData.fbratingId,
          };
          setRatingOptions((prev) => [...prev, newOption]);
          setMessage("Rating option added successfully!");
        }
        setOpenSnackbar(true);
        resetForm();
      } catch (error) {
        console.error("Error saving rating option:", error);
        setMessage(
          error.response
            ? error.response.data.message || "Error saving rating option."
            : "Error saving rating option."
        );
        setOpenSnackbar(true);
      }
    }
  };
  const validateForm = () => {
    const { fbratingId, sname, description, ratingValue } = formData;
    if (!fbratingId || !sname || !description || !ratingValue) {
      alert("Please fill all fields!");
      return false;
    }
    return true;
  };
  const resetForm = () => {
    setFormData({ sname: "", description: "", ratingValue: "", fbratingId: "" });
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleEditOpen = (option) => {
    setFormData({
      sname: option.sname,
      description: option.description,
      ratingValue: option.rating_value,
      fbratingId: option.fbratingId,
    });
    setEditId(option.id);
    setIsEdit(true);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth3/rating-options`);
      setRatingOptions((prev) => prev.filter((option) => option.id !== id));
      setMessage("Rating option deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting rating option:", error);
      setMessage(
        error.response
          ? error.response.data.message || "Error deleting rating option."
          : "Error deleting rating option."
      );
      setOpenSnackbar(true);
    }
  };

  const getRatingTypeName = (id) => {
    const type = ratingTypes.find((rt) => rt.id === id);
    return type ? type.type : "N/A";
  };
  
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth3/category?page=${currentPage}&size=${pageSize}`)
      .then((result) => {
        console.log(result.data); // Check API response in the console
        if (result.data.feedbackcategory) {
          setRatingOptions(result.data.feedbackroptions);  // Set batch data
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
  
  const permissions = checkPermissions(roleId);
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" align="center" color="red" fontWeight="bold" sx={{ }}>
        Feedback Rating
      </Typography>
      <Button
        variant="contained"
        color="success"
        sx={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", marginBottom: "20px" }}
        onClick={() => setShowForm(true)}
      >
        ADD RATING
      </Button>
      <Dialog open={showForm} onClose={resetForm}>
  <DialogTitle>{isEdit ? "Edit Rating Option" : "Add Rating Option"}</DialogTitle>
  <DialogContent>
    <Box sx={{ padding: "16px" }}> {/* Added padding here */}
      <TextField
        label="Sname"
        name="sname"
        value={formData.sname}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={{ marginBottom: "16px" }} // Add margin between fields
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={{ marginBottom: "16px" }} // Add margin between fields
      />
      <TextField
        label="Rating Value"
        name="ratingValue"
        value={formData.ratingValue}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={{ marginBottom: "16px" }} // Add margin between fields
      />
      <FormControl fullWidth size="small" sx={{ marginTop: "16px" }}>
        <InputLabel id="rating-type-label">Rating Type</InputLabel>
        <Select
          labelId="rating-type-label"
          name="fbratingId"
          value={formData.fbratingId}
          onChange={handleChange}
          label="Rating Type"
        >
          {ratingTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.type || "Invalid Type"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      {isEdit ? "Update" : "Add"}
    </Button>
    <Button variant="contained" color="error" onClick={resetForm}>
      Cancel
    </Button>
  </DialogActions>
</Dialog>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="rating options table">
          <TableHead>
            <TableRow>
              {/* <TableCell style={{ fontWeight: "bold" }}>ID</TableCell> */}
              <TableCell style={{ fontWeight: "bold" }}>Sname</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Rating Value</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Feedback Rating Type</TableCell>
              {permissions.canEdit && (<TableCell style={{ fontWeight: "bold" }}>Action</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {ratingOptions.length > 0 ? (
              ratingOptions.map((option) => (
                <TableRow key={option.id}>
                  {/* <TableCell>{option.id}</TableCell> */}
                  <TableCell>{option.sname}</TableCell>
                  <TableCell>{option.description}</TableCell>
                  <TableCell>{option.rating_value}</TableCell>
                  <TableCell>{getRatingTypeName(option.fbratingId)}</TableCell> 
                  {permissions.canEdit && (
  <TableCell>
    <button
      onClick={() => handleEditOpen(option)}
      className="btn btn-primary me-2"
      style={{
        padding: '8px 16px',
        borderRadius: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      Edit
    </button>
    {permissions.canDelete && (
      <button
        onClick={() => handleDelete(option.id)}
        className="btn btn-danger"
        style={{
          padding: '8px 16px',
          borderRadius: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Delete
      </button>

    )}
  </TableCell>
    )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No rating options available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={openSnackbar} onClose={handleCloseSnackbar} message={message} autoHideDuration={6000} />
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
      </Box>
  );
};
export default RatingOptions;
