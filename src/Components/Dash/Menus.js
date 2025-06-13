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
import axios from "axios";
import DashboardIcon from "@mui/icons-material/Dashboard";
import api from "../axiosInstance";

const Menus = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);
  const roleId = parseInt(sessionStorage.getItem("roleId"), 10);

  useEffect(() => {
    // Fetch menu items based on roleId
    const fetchMenuItems = async () => {
      try {
        const response = await api.post(`/auth/getMenu`, { roleId });
        setMenuItems(response.data || []);  // Ensure menuItems is an array
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]); // Set to empty array on error
      }
    };

    fetchMenuItems();
  }, [roleId]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

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

    // If no menu items are present, do not render the component
    if (menuItems.length === 0) {
      return null;
    }

  const menuStyle = {
    position: "absolute",
    background: "#F0F0F0",
    zIndex: 1000,
    width: "100%",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <Tooltip title="Click Here" placement="right" arrow>
        <Button onClick={handleToggle} style={{ color: "white" }}>
          <DashboardIcon />
          <span className="ms-2 d-none d-sm-inline">Config Menu</span>
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

export default Menus;

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Collapse,
//   List,
//   ListItem,
//   ListItemText,
//   Tooltip,
// } from "@mui/material";
// import { ArrowDropDown } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import DashboardIcon from "@mui/icons-material/Dashboard";

// const Menus = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [menuItems, setMenuItems] = useState([]);
//   const roleId = parseInt(localStorage.getItem("roleId"), 10);

//   const handleToggle = () => {
//     setIsExpanded(!isExpanded);
//   };

//   useEffect(() => {
//     // Fetch menu items based on role ID
//     const fetchMenuItems = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth2/getmenu/${roleId}`);
//         setMenuItems(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//       }
//     };

//     fetchMenuItems();
//   }, [roleId]);

//   return (
//     <div style={{ position: "relative" }}>
//       <Tooltip title="Click Here" placement="right" arrow>
//         <Button onClick={handleToggle} style={{ color: "white" }}>
//           <DashboardIcon />
//           <span className="ms-2 d-none d-sm-inline">Config Menu</span>
//           <ArrowDropDown />
//         </Button>
//       </Tooltip>
//       <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//         <List component="div" disablePadding style={{ background: "#F0F0F0" }}>
//           {menuItems.map((item) => (
//             <ListItem
//               key={item.id}
//               button
//               component={Link}
//               to={item.url}
//               onClick={() => setIsExpanded(false)}
//               sx={{ "&:hover": { backgroundColor: "#e0e0e0" } }}
//             >
//               <ListItemText primary={item.Menuname} />
//             </ListItem>
//           ))}
//         </List>
//       </Collapse>
//     </div>
//   );
// };

// export default Menus;
