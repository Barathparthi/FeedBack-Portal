import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";

const ApprovalHierarchy = () => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedApprover, setSelectedApprover] = useState("");
  const [approvers, setApprovers] = useState([]);
  const [approvalOrders, setApprovalOrders] = useState([]);

  const leaveTypes = [
    { id: 1, name: "Vacation" },
    { id: 2, name: "Sick Leave" },
  ];

  const handleApproverChange = (index, approverId) => {
    const updatedApprovers = [...approvers];
    updatedApprovers[index] = approverId;
    setApprovers(updatedApprovers);
  };

  const addApprovalOrder = () => {
    setApprovalOrders([...approvalOrders, { role: "", final: false }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic to handle form submission here
    console.log("Selected Type:", selectedType);
    console.log("Selected Approvers:", approvers);
    console.log("Approval Orders:", approvalOrders);
    // Reset form state after submission
    setSelectedType("");
    setSelectedApprover("");
    setApprovers([]);
    setApprovalOrders([]);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
      <Grid item xs={10} component={Paper} elevation={6} square>
        <Box p={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Leave Approval Hierarchy
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="type">Type of Leave</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Table sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order No</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvalOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormControl fullWidth required>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={order.role}
                          onChange={(e) => handleApproverChange(index, e.target.value)}
                        >
                          {approvers.map((approver, index) => (
                            <MenuItem key={index} value={approver.id}>
                              {approver.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={order.final}
                        onChange={(e) =>
                          setApprovalOrders((prevOrders) =>
                            prevOrders.map((prevOrder, i) =>
                              i === index ? { ...prevOrder, final: e.target.checked } : prevOrder
                            )
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addApprovalOrder}
                sx={{ mr: 1 }}
              >
                Add Approval Order
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ApprovalHierarchy;
