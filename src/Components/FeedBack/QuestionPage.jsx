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
  DialogContentText,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { checkPermissions } from "../Helper/RolePermission";
import api from "../axiosInstance";

function QuestionPage() {
  const navigate = useNavigate();
  const { page = 2 } = useParams();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    qno: "",
    feedbackQuestion: "",
    courseCategory: "",
    ratingType: "",
  });
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedFbGroup, setSelectedFbGroup] = useState(null);
  const [ratingTypes, setRatingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [totalPages, setTotalPages] = useState(null);
  const [fbGroups, setFbGroups] = useState([]);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchQuestions();
      await fetchCategories();
      await fetchRatingTypes();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFeedbackGroups = async () => {
      try {
        const response = await api.get("/auth3/fbgroup");
        setFbGroups(response.data);
      } catch (error) {
        console.error("Error fetching feedback groups:", error);
      }
    };
    fetchFeedbackGroups();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/auth3/question");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const fetchCategories = async (fbGroupId) => {
    try {
      const response = await api.get(
        `/auth3/categories/${fbGroupId}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRatingTypes = async () => {
    try {
      const response = await api.get("/auth3/rating");
      setRatingTypes(response.data);
    } catch (error) {
      console.error("Error fetching rating types:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setNewQuestion({
      qno: "",
      feedbackQuestion: "",
      courseCategory: "",
      ratingType: "",
    });
  };

  const handleEditOpen = (question) => {
    setEditQuestionId(question.id);
    setNewQuestion({
      qno: question.qnoId,
      feedbackQuestion: question.question,
      courseCategory: question.fbCategory,
      ratingType: question.fbratingId,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewQuestion({
      qno: "",
      feedbackQuestion: "",
      courseCategory: "",
      ratingType: "",
    });
    setEditQuestionId(null);
  };

  const handleFbGroupChange = (event) => {
    const selectedGroupId = event.target.value;
    setSelectedFbGroup(selectedGroupId);
    fetchCategories(selectedGroupId);
  };

  const handleChange = (field) => (event) => {
    setNewQuestion({
      ...newQuestion,
      [field]: event.target.value,
    });
  };

  const handleAdd = async () => {
    try {
      await api.post("/auth3/aquestion", {
        qnoId: newQuestion.qno,
        question: newQuestion.feedbackQuestion,
        fbratingId: newQuestion.ratingType,
        fbCategory: newQuestion.courseCategory,
        groupId: selectedFbGroup,
      });
      fetchQuestions();
      handleClose();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/auth3/equestion`, {
        id: editQuestionId,
        qnoId: newQuestion.qno,
        question: newQuestion.feedbackQuestion,
        fbratingId: newQuestion.ratingType,
        fbCategory: newQuestion.courseCategory,
      });
      fetchQuestions();
      handleClose();
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth3/question/${id}`);  
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Loading...";
  };

  const getRatingTypeName = (ratingTypeId) => {
    const rating = ratingTypes.find((rt) => rt.id === ratingTypeId);
    return rating ? rating.type : "Unknown";
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
        style={{ color: "blue", marginBottom: "20px", fontWeight: "bold" }}
      >
        Feedback Questions
      </Typography>
      <Grid container spacing={2} justifyContent="flex-start">
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpen}
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "10px 20px",
              backgroundColor: "#2e7d32",
              color: "white",
              borderRadius: "10px",
              textTransform: "uppercase",
            }}
          >
            Add Question
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" marginTop={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto", marginTop: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Qno
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Feedback Question
                  </TableCell>
                  {/* <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Course Category
                  </TableCell> */}
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Rating Type
                  </TableCell>
                  {/* <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Feedback Group
                  </TableCell> */}
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.qnoId}</TableCell>
                    <TableCell>{row.question}</TableCell>
                    {/* <TableCell>{getCategoryName(row.fbCategory)}</TableCell> */}
                    <TableCell>{getRatingTypeName(row.fbratingId)}</TableCell>
                    {/* <TableCell>{row.fbGroup}</TableCell> */}
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
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? "Edit Question" : "Add New Question"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditing
              ? "Update the details of the feedback question."
              : "Enter the details of the new feedback question."}
          </DialogContentText>
          <TextField
            label="Question No"
            variant="outlined"
            fullWidth
            value={newQuestion.qno}
            onChange={handleChange("qno")}
            style={{ marginBottom: "20px" }}
          />
                    <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel>Feedback Group</InputLabel>
            <Select
              value={selectedFbGroup}
              onChange={handleFbGroupChange}
              label="Feedback Group"
            >
              {fbGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newQuestion.courseCategory}
              onChange={handleChange("courseCategory")}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Feedback Question"
            variant="outlined"
            fullWidth
            value={newQuestion.feedbackQuestion}
            onChange={handleChange("feedbackQuestion")}
            style={{ marginBottom: "20px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel>Rating Type</InputLabel>
            <Select
              value={newQuestion.ratingType}
              onChange={handleChange("ratingType")}
              label="Rating Type"
            >
              {ratingTypes.map((rating) => (
                <MenuItem key={rating.id} value={rating.id}>
                  {rating.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={isEditing ? handleEditSave : handleAdd}
            color="primary"
          >
            {isEditing ? "Save Changes" : "Add Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default QuestionPage;
