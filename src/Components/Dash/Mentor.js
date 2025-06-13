import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { Link } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import api from "../axiosInstance";

const Mentor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);
  const roleId = parseInt(sessionStorage.getItem("roleId"), 10);

  // Fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.post(`/auth1/getMentor`, { roleId });
        setMenuItems(response.data || []); // Ensure menuItems is an array
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]); // Set to empty array on error
      }
    };

    fetchMenuItems();
  }, [roleId]);

  // Toggle dropdown visibility
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const menuStyle = {
    position: "absolute",
    background: "#F0F0F0",
    zIndex: 1000,
    width: "100%",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
  };

  // If no menu items are present, do not render the component
  if (menuItems.length === 0) {
    return null;
  }

  // Render the button and dropdown if menu items exist
  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <Tooltip title="Click Here" placement="right" arrow>
        <Button onClick={handleToggle} style={{ color: "white" }}>
          <SupervisorAccountIcon />
          <span className="ms-2 d-none d-sm-inline">Mentor System</span>
          <ArrowDropDown />
        </Button>
      </Tooltip>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <div style={menuStyle}>
          <List
            component="div"
            disablePadding
            style={{ marginLeft: "15px", color: "black" }}
          >
            {menuItems.map((menuItem, index) => (
              <ListItem
                button
                component={Link}
                to={menuItem.url}
                key={index}
                onClick={() => setIsExpanded(false)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <ListItemText primary={menuItem.smenu} />
              </ListItem>
            ))}
          </List>
        </div>
      </Collapse>
    </div>
  );
};

export default Mentor;