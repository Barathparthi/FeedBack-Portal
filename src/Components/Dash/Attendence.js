import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Collapse, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Attendence component to manage attendance related features
const Attendence = () => {
  // State to manage the expansion of attendance menu
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expansion state
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Custom style for the menu
  const menuStyle = {
    background: '#F0F0F0', // Example background color
    borderRadius: '0px', // Optional: if you want rounded corners
    // boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' // Optional: if you want to add some shadow for depth
  };

  // Render
  return (
    <div>
      {/* Tooltip for the attendance button */}
      <Tooltip title="Click Here" placement="right" arrow>
        <Button
          onClick={handleToggle}
          style={{ color: "white" }}
        >
          {/* Attendance button with icon and text */}
          <CalendarMonthIcon />
          <span className="ms-2 d-none d-sm-inline">Attendence</span>
          <ArrowDropDown />
        </Button>
      </Tooltip>
      {/* Attendance menu */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <div style={menuStyle}>
          {/* List of attendance related options */}
          <List component="div" disablePadding style={{ marginLeft: '20px', color:'black' }}>
            {/* Link to academic year page */}
            <ListItem button component={Link} to="/dashboard/time" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="TimeTable" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/smapping" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Student Mapping" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/aconfig" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Attendance Config" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/academic_year" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Attendance" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/day" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Day" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/academic_year" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Building" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/academic_year" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Floor" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/academic_year" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Venue" />
            </ListItem>
          
            {/* Add more menu items as needed */}
          </List>
        </div>
      </Collapse>
    </div>
  );
};

export default Attendence;
