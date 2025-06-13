import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  CircularProgress,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import axios from "axios";
import api from "../axiosInstance";

const Btech = () => {
  const [fsmappings, setFsMappings] = useState([]);
  const [loginId, setLoginId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [selectedMappingId, setSelectedMappingId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [queries, setQueries] = useState({});
  const [mappingId, setMappingId] = useState(null);
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchLoginId();
  }, []);

  const fetchLoginId = async () => {
    const storedLoginId = sessionStorage.getItem("loginId");
    if (storedLoginId) {
      const parsedLoginId = parseInt(storedLoginId, 10);
      setLoginId(parsedLoginId);
      await fetchStudentDetails(parsedLoginId); 
    }
  };

  const fetchStudentDetails = async (loginId) => {
    try {
      const response = await api.get(
        "/auth3/getStudentByLoginId",
        {
          params: { loginId }, 
        }
      );

      const studentData = response.data;
      if (studentData.id) {
        setStudentId(studentData.id);
        fetchMappings(studentData.id); 
      } else {
        console.error("Student ID not found for the provided login ID.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchMappings = async (studentId) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await api.get("/auth3/fsmapping", {
        params: {
          StudentId: studentId,
          Sdate: sDate || currentDate,
          Edate: eDate || currentDate,
        },
      });
      setFsMappings(response.data);
    } catch (error) {
      console.error("Error fetching fsmapping data:", error);
    }
  };
  const handleViewClick = async (id) => {
    setSelectedMappingId(id);
    setMappingId(id);
    try {
      const response = await api.get(
        "/auth3/fetch-questions",
        {
          params: { fsmappingId: id },
        }
      );
      const questionsData = response.data;

      const uniqueQuestions = Array.from(
        new Map(
          questionsData.map((question) => [question.id, question])
        ).values()
      );

      const updatedQuestions = await Promise.all(
        uniqueQuestions.map(async (question) => {
          const options = await fetchRatingOptions(question.fbratingId);
          return { ...question, ratingOptions: options };
        })
      );

      setQuestions(updatedQuestions);

      const initialQueries = updatedQuestions.reduce((acc, question) => {
        acc[question.id] = {
          rating: "",
          queryText: "",
          showQueryText: false,
          roptionId: null,
        };
        return acc;
      }, {});

      setQueries(initialQueries);
    } catch (error) {
      console.error("Error fetching questions data:", error);
    }
  };

  const fetchRatingOptions = async (fbratingId) => {
    try {
      const response = await api.get("/auth3/rating-o", {
        params: { fbratingId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching rating options:", error);
      return [];
    }
  };
  const handleRatingChange = (questionId, rvalue, optionId) => {
    setQueries((prevState) => ({
      ...prevState,
      [questionId]: {
        ...prevState[questionId], 
        rating: rvalue,
        roptionId: optionId, 
      },
    }));
  };

  const handleSubmit = async () => {
    if (!mappingId) {
      alert("Please select a mapping before submitting feedback.");
      return;
    }
    const missingResponses = questions.filter((question) => {
      const response = queries[question.id];
      const hasRating = response?.roptionId;
      const hasComment = question.fbratingId === 1 && response?.queryText?.trim();
  
      return !(hasRating || hasComment);
    });
  
    if (missingResponses.length > 0) {
      alert("Please answer all the questions before submitting.");
      return;
    }
  
    try {
       setIsLoading(true);
      const submissionData = questions.map((question) => {
        const response = queries[question.id];
        return {
          FsMappingId: mappingId,
          FquestionId: question.id,
          FbroptionId: response?.roptionId || null,
          comments: question.fbratingId === 1 ? response?.queryText?.trim() || "" : "", 
        };
      });
  
      const response = await api.post(
        "/auth3/submitFeedback",
        submissionData
      );
      alert(response.data.message);
      fetchMappings(studentId);
      setSelectedMappingId(null);
      setQueries({});
      setQuestions([]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback.");
    }
    finally{
      setIsLoading(false);
    }
  };
  
  const filteredMappings = studentId
    ? fsmappings.filter((mapping) => {
        const currentDate = new Date();
        const startDate = new Date(mapping.Sdate);
        const endDate = new Date(mapping.Edate);

        return (
          mapping.StudentId === studentId &&
          currentDate >= startDate &&
          currentDate <= endDate &&
          mapping.Posted === 0
        );
      })
    : [];
  return (
    <Box>
      <TableContainer component={Paper}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }} style={{ color: 'red', marginBottom: '20px', fontWeight: 'bold' }}>
            FEEDBACK
          </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Staff Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMappings.length > 0 ? (
              filteredMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{mapping.code}</TableCell>
                  <TableCell>{mapping.description}</TableCell>
                  <TableCell>{mapping.FirstName}</TableCell>
                  <TableCell>
                    {mapping.Posted === 0 ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewClick(mapping.id)}
                      >
                        View
                      </Button>
                    ) : (
                      <Typography>Submit</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedMappingId && questions.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">Questions</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            ml={4}
          >
            {questions.map((question) => (
              <Box key={question.id} mb={3}>
                <Typography variant="body1" gutterBottom>
                  {question.qnoId}. {question.question}
                </Typography>
                {question.fbratingId === 1 ? (
                  <TextField
                    variant="outlined"
                    label="Comments"
                    value={queries[question.id]?.queryText || ""}
                    onChange={(e) =>
                      setQueries((prevState) => ({
                        ...prevState,
                        [question.id]: {
                          ...prevState[question.id],
                          queryText: e.target.value,
                          showQueryText: true,
                        },
                      }))
                    }
                    fullWidth
                  />
                ) : (
                  <FormControl component="fieldset">
  <RadioGroup
    row
    value={queries[question.id]?.rating || ""}
    onChange={(e) => {
      handleRatingChange(
        question.id,
        e.target.value,
        question.ratingOptions.find(
          (option) => option.Rvalue === e.target.value
        )?.id
      );
    }}
  >
    {question.ratingOptions.map((option) => (
      <FormControlLabel
        key={option.Rvalue}
        value={option.Rvalue} 
        control={<Radio />}
        label={option.description}
      />
    ))}
  </RadioGroup>
</FormControl>

                )}
              </Box>
            ))}
              <Button
variant="contained"
color="primary"
onClick={handleSubmit}
disabled={isLoading} 
sx={{ mt: 2 }}
>
{isLoading ? <CircularProgress size={24} /> : "Submit"}
</Button>
          </Box>
        </Paper>
      )}
    </Box>   );
 };
  export default Btech;