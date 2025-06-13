import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  Feedback as FeedbackIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import api from "../axiosInstance";

const StudentDashboard = () => {
  const loginId = sessionStorage.getItem("loginId");
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student");
  const [pendingFeedback, setPendingFeedback] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // Default to 15 minutes in seconds

  useEffect(() => {
    // Fetch login timestamp from localStorage or set it if not present
    let loginTimestamp = sessionStorage.getItem("loginTimestamp");
    if (!loginTimestamp && loginId) {
      // Set timestamp if not already set (e.g., first load after login)
      loginTimestamp = Date.now();
      sessionStorage.setItem("loginTimestamp", loginTimestamp);
    } else if (!loginId) {
      // No loginId, redirect to login
      navigate("/adminlogin");
      return;
    }

    // Calculate remaining time based on login timestamp
    const calculateRemainingTime = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - loginTimestamp) / 1000);
      const totalSessionTime = 15 * 60; // 15 minutes in seconds
      const remaining = Math.max(0, totalSessionTime - elapsedSeconds);
      return remaining;
    };

    // Set initial time left
    const initialTimeLeft = calculateRemainingTime();
    setTimeLeft(initialTimeLeft);

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem('valid');
          sessionStorage.removeItem('loginId');
          sessionStorage.removeItem('roleId');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem("loginTimestamp");
          navigate("/adminlogin");
          return 0;
        }
        return Math.max(0, prevTime - 1);
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [loginId, navigate]);

  // Fetch student details
  useEffect(() => {
    if (loginId) {
      api
        .get(`/auth3/pending-feedback/${loginId}`)
        .then((response) => {
          setStudentName(response.data.studentName || "Student");
          setPendingFeedback(response.data.pendingCourses);
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
        });
    }
  }, [loginId]);

  // Format time left as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const dashboardCards = [
    {
      icon: <FeedbackIcon fontSize="large" color="success" />,
      title: "Feedback",
      description: `You have ${pendingFeedback} feedback(s) pending`,
      color: "success",
      path: "/dashboard/student-feedback",
    },
    {
      icon: <SchoolIcon fontSize="large" color="warning" />,
      title: "Attendance",
      description: "Track your class attendance",
      color: "warning",
      path: "/dashboard/student-attendance",
    },
    {
      icon: <AssignmentIcon fontSize="large" color="secondary" />,
      title: "Grades",
      description: "View your academic performance",
      color: "secondary",
      path: "/dashboard",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {studentName}
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={1}>
          {currentDate}
        </Typography>
        {/* <Typography variant="body2" color="error">
          Session expires in: {formatTime(timeLeft)}
        </Typography> */}
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3} justifyContent="center">
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.03)",
                  transition: "all 0.3s ease-in-out",
                },
                cursor: "pointer",
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon}
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ ml: 2 }}
                    color={card.color}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {card.description}
                </Typography>
                {card.title === "Feedback" && pendingFeedback > 0 && (
                  <Chip
                    label={`${pendingFeedback} Pending`}
                    color="error"
                    size="small"
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentDashboard;