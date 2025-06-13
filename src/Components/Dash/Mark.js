import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Collapse, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import RuleIcon from '@mui/icons-material/Rule';

// Mark component to manage mark related features
const Mark = () => {
  // State to manage the expansion of mark menu
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
      {/* Tooltip for the mark button */}
      <Tooltip title="Click Here" placement="right" arrow>
        <Button
          onClick={handleToggle}
          style={{ color: "white" }}
        >
          {/* Mark button with icon and text */}
          <RuleIcon />
          <span className="ms-2 d-none d-sm-inline">Mark SplitUp</span>
          <ArrowDropDown />
        </Button>
      </Tooltip>
      {/* Mark menu */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <div style={menuStyle}>
          {/* List of mark related options */}
          <List component="div" disablePadding style={{ marginLeft: '20px',color:'black' }}>
            {/* Link to academic year page */}
            <ListItem button component={Link} to="/dashboard/academic_year" onClick={() => setIsExpanded(false)}>
              <ListItemText primary="Academic Year" />
            </ListItem>
            {/* Add more menu items as needed */}
          </List>
        </div>
      </Collapse>
    </div>
  );
};

export default Mark;
