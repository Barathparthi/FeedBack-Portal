import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";
import { checkPermissions } from "../Helper/RolePermission";

function FeedbackType() {
  const navigate = useNavigate();
  const { page = 1 } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newRecord, setNewRecord] = useState({ Sname: "", name: "" });
  const [editRecordId, setEditRecordId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [roleId, setRoleId] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [isloading, setIsLoading] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);
  useEffect(() => {
    fetchFeedbacks();
    fetchRoleId();
  }, [currentPage, pageSize]);
  const fetchRoleId = () => {
    const roleId = sessionStorage.getItem("roleId");
    setRoleId(roleId);
  };
  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/auth3`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth3`, { data: { id } });
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };
  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setNewRecord({ Sname: "", name: "" });
  };
  const handleClose = () => {
    setOpen(false);
    setNewRecord({ Sname: "", name: "" });
    setEditRecordId(null);
  };
  const handleChange = (prop) => (event) => {
    setNewRecord({ ...newRecord, [prop]: event.target.value });
  };
  const handleAdd = async () => {
    try {
      await api.post(`/auth3/created`, newRecord);
      fetchFeedbacks();
      handleClose();
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  };
  const handleEditOpen = (record) => {
    setEditRecordId(record.id);
    setNewRecord({ Sname: record.Sname, name: record.name });
    setIsEditing(true);
    setOpen(true);
  };
  const handleEditSave = async () => {
    try {
      await api.put(`/auth3/edit`, {
        id: editRecordId,
        ...newRecord,
      });
      fetchFeedbacks();
      handleClose();
    } catch (error) {
      console.error("Error editing feedback category:", error);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth3?page=${currentPage}&pageSize=${pageSize}`)
      .then((result) => {
        // console.log(result.data); // Check API response in the console
        if (result.data.feedback) {
          setFeedback(result.data.feedback); // Set batch data
          setTotalPages(result.data.totalPages); // Set total pages
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
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}
      >
        Feedback Type
      </Typography>
      <Grid container spacing={2} justifyContent="flex-start">
        {permissions.canAdd && (
          <Grid item>
            <button
              onClick={handleOpen}
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "10px 20px",
                backgroundColor: "#2e7d32",
                color: "white",
                borderRadius: "10px",
                textTransform: "uppercase",
                border: "none",
              }}
            >
              Add Type
            </button>
          </Grid>
        )}
      </Grid>
      <Box sx={{ overflowX: "auto", marginTop: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  S.Name
                </TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  Description
                </TableCell>
                {permissions.canEdit && (
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{ fontSize: "1.1rem", color: "red" }}>
                    {row.Sname}
                  </TableCell>
                  <TableCell style={{ fontSize: "1.1rem" }}>
                    {row.name}
                  </TableCell>
                  {permissions.canEdit && (
                    <TableCell>
                      <button
                        onClick={() => handleEditOpen(row)}
                        className="btn btn-primary me-2"
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Edit
                      </button>
                      {permissions.canDelete && (
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="btn btn-danger"
                          style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>{" "}
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? "Edit Feedback Type" : "Add Feedback Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="S.Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecord.Sname}
            onChange={handleChange("Sname")}
            InputProps={{ style: { fontSize: "1.1rem" } }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecord.name}
            onChange={handleChange("name")}
            InputProps={{ style: { fontSize: "1.1rem" } }}
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: "#616161",
              color: "white",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              border: "none",
            }}
          >
            Cancel
          </button>
          <button
            onClick={isEditing ? handleEditSave : handleAdd}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              border: "none",
            }}
          >
            {isEditing ? "Save" : "Add"}
          </button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          position: "relative",
        }}
      >
        <div
          className="d-flex justify-content-center"
          style={{
            alignItems: "center",
            height: "35px",
            position: "fixed",
            bottom: "0",
            width: "100%",
          }}
        >
          <div>Page Size:</div>
          <label style={{ position: "relative", display: "inline-block" }}>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="form-control"
              style={{
                height: "30px",
                fontSize: "12px",
                appearance: "none",
                paddingRight: "25px",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
            <ArrowDropDownIcon
              style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </label>

          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn btn-sm btn-success"
            style={{ padding: "5px 6px", fontSize: "12px" }}
          >
            Previous Page
          </button>

          <span className="mx-2" style={{ fontSize: "12px" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="btn btn-sm btn-success"
            style={{ padding: "5px 6px", fontSize: "12px" }}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackType;
