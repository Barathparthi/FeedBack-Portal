import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import api from "../axiosInstance";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      color: "#3f51b5",
      fontWeight: 600,
    },
  },
});

const LoginReset = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for the search query

  useEffect(() => {
    api.get(`/auth2/roles`).then((response) => {
      setRoles(response.data);
    });
  }, []);

  const fetchUsers = (roleId) => {
    setLoader(true);
    api
      .get(`/auth/users/${roleId}`)
      .then((response) => {
        setUsers(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoader(false);
      });
  };

  const handleRoleChange = (event) => {
    const roleId = event.target.value;
    setSelectedRole(roleId);
    fetchUsers(roleId);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleReset = () => {
    const updates = selectedUsers.map((userId) => ({
      user_id: userId,
      role_id: selectedRole,
    }));

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/reset-users`, { updates })
      .then(() => {
        alert("Selected users have been updated successfully!");
        setSelectedUsers([]);
      })
      .catch((error) => {
        console.error("Error updating users:", error);
      });
  };

  // Filtered users based on the search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Role-Based User Management
        </Typography>
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 1000, p: 3 }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              {/* Search field */}
              <TextField
                label="Search by Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleReset}
            sx={{ mt: 3 }}
            disabled={!selectedRole || loader}
          >
            Reset
          </Button>

          {loader ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      checked={
                        users.length > 0 &&
                        selectedUsers.length === users.length
                      }
                      onChange={() => {
                        if (selectedUsers.length === users.length) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(users.map((user) => user.id));
                        }
                      }}
                    />
                  </TableCell>
                  {/* <TableCell>User ID</TableCell> */}
                  <TableCell>Username</TableCell>
                  {/* <TableCell>Password</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                      />
                    </TableCell>
                    {/* <TableCell>{user.id}</TableCell> */}
                    <TableCell>{user.username}</TableCell>
                    {/* <TableCell>{user.password}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleReset}
            sx={{ mt: 3 }}
            disabled={!selectedRole || loader}
          >
            Reset
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginReset;
