import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

const LeaveApproval = () => {
  // State for managing leave requests
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulated data for leave requests
  const sampleLeaveRequests = [
    { id: 1, name: "John Doe", leaveType: "Sick Leave", startDate: "2022-04-01", endDate: "2022-04-03", status: "Pending" },
    { id: 2, name: "Jane Smith", leaveType: "Vacation Leave", startDate: "2022-04-05", endDate: "2022-04-10", status: "Pending" },
    { id: 3, name: "Alice Johnson", leaveType: "Personal Leave", startDate: "2022-04-15", endDate: "2022-04-17", status: "Approved" },
    { id: 4, name: "Bob Brown", leaveType: "Sick Leave", startDate: "2022-04-20", endDate: "2022-04-21", status: "Declined" },
  ];

  // Simulated API call to fetch leave requests
  const fetchLeaveRequests = () => {
    setLoading(true);
    // Assume fetching leave requests from an API endpoint
    setTimeout(() => {
      setLeaveRequests(sampleLeaveRequests);
      setLoading(false);
    }, 1000); // Simulate delay
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
      <Grid item xs={10} component={Paper} elevation={6} square>
        <Box p={5}>
          <Typography variant="h4" align="center" gutterBottom>
            Leave Approval
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary">
                        Approve
                      </Button>
                      <Button variant="contained" color="error" sx={{ ml: 1 }}>
                        Decline
                      </Button>
                      <Button variant="contained" color="info" sx={{ ml: 1 }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default LeaveApproval;
