import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from '@mui/material';
import axios from 'axios';
import api from '../axiosInstance';

const Question = () => {
  const [questions, setQuestions] = useState([]); 
  const [ratings, setRatings] = useState({});
  const [ratingOptions, setRatingOptions] = useState([]);
  const [additionalComments, setAdditionalComments] = useState({}); 
  const [showCommentBox, setShowCommentBox] = useState({}); 
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/auth3/question`); 
        setQuestions(response.data); 
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    const fetchRatingOptions = async () => {
      try {
        const response = await api.get(`/auth3/rating-options`); 
        setRatingOptions(response.data); 
      } catch (error) {
        console.error('Error fetching rating options:', error);
      }
    };

    fetchQuestions();
    fetchRatingOptions(); 
  }, []); 
  const handleRatingChange = (questionId, value) => {
    setRatings((prevRatings) => ({ ...prevRatings, [questionId]: value }));
    if (value === 'needs_comments') { 
      setShowCommentBox((prev) => ({ ...prev, [questionId]: true }));
      setAdditionalComments((prev) => ({ ...prev, [questionId]: '' })); 
    } else {
      setShowCommentBox((prev) => ({ ...prev, [questionId]: false })); 
      setAdditionalComments((prev) => ({ ...prev, [questionId]: '' })); 
    }
  };

  const handleCommentChange = (questionId, value) => {
    setAdditionalComments((prevComments) => ({ ...prevComments, [questionId]: value }));
  };

  const handleSubmit = () => {
    const submissionData = {
      ratings,
      additionalComments,
    };
    // console.log('Submit data:', submissionData);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Questions</Typography>
      {questions.map((question) => (
        <Box key={question.id} sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{question.question}</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={ratings[question.id] || ''} 
              onChange={(e) => handleRatingChange(question.id, e.target.value)}
            >
              {ratingOptions.map((option) => (
                <FormControlLabel
                  key={option.id} 
                  control={
                    <Radio
                      sx={{
                        color: 'blue',
                        '&.Mui-checked': {
                          color: 'blue',
                        },
                      }}
                    />
                  }
                  label={option.description} 
                  value={option.value} 
                />
              ))}
            </RadioGroup>
          </FormControl>
          {showCommentBox[question.id] && (
            <TextField
              label="Comments"
              value={additionalComments[question.id] || ''}
              onChange={(e) => handleCommentChange(question.id, e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{ marginTop: 1 }} // Space above the textbox
            />
          )}
        </Box>
      ))}
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default Question;