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

const RoleMapping = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [menuGroups, setMenuGroups] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    api.get(`/auth2/roles`).then((response) => {
      setRoles(response.data);
    });
  }, []);

  const fetchMenus = (roleId) => {
    setLoader(true);
    api
      .get(`/auth2/menus/${roleId}`)
      .then((response) => {
        // Group menu items by mmenu_name and order by `order`
        const groupedMenus = response.data.reduce((acc, item) => {
          const groupName = item.Menu_Name;
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(item);
          acc[groupName].sort((a, b) => a.order - b.order); // Order by `order` field
          return acc;
        }, {});
        setMenuGroups(groupedMenus);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
        setLoader(false);
      });
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    fetchMenus(event.target.value);
  };

  const handleCheckboxChange = (submenuId, groupName) => {
    setMenuGroups((prevGroups) => {
      const updatedGroup = prevGroups[groupName].map((item) =>
        item.id === submenuId ? { ...item, enable: item.enable ? 0 : 1 } : item
      );
      return { ...prevGroups, [groupName]: updatedGroup };
    });
  };

  const handleSave = () => {
    const updates = Object.values(menuGroups)
      .flat()
      .map((item) => ({
        submenu_id: item.id,
        role_id: selectedRole,
        enable: item.enable,
      }));

    Promise.all(
      updates.map((update) => api.post(`/auth2/update-enable`, update))
    )
      .then(() => {
        alert("Enable values updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating enable values:", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Role-Based Menu Mapping
        </Typography>
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 800, p: 3 }}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              label="Role"
              disabled={loader}
            >
              {roles.map(
                (role) =>
                  role.name !== "SuperAdmin" && (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>

          {loader ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            Object.keys(menuGroups).map((groupName) => (
              <Box key={groupName} mt={3}>
                <Typography variant="h6">{groupName}</Typography>
                <Grid container spacing={1} mt={1}>
                  {menuGroups[groupName].map((menu) => (
                    <Grid item xs={3} key={menu.id}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          backgroundColor: menu.enable ? "#e0f7fa" : "#ffebee",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography>{menu.menuname}</Typography>
                        <Checkbox
                          checked={menu.enable === 1}
                          onChange={() =>
                            handleCheckboxChange(menu.id, groupName)
                          }
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            sx={{ mt: 3 }}
            disabled={!selectedRole || loader}
          >
            Save
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RoleMapping;
