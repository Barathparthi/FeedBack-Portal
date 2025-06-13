import React from 'react'; // Removed unused imports
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Divider, ListItemButton, ListItemIcon } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useContext } from 'react';
import { AuthContext } from '../Dash/AuthContext'; // Adjust path if needed
import '../../Components/Dash/Dashboard.css';
import logo from '../../assets/Sret w.png';
import logo1 from '../../assets/Sriher_logo1.jpg';
import Menus from './Menus';
import TimeTable from './Timetable';
import Mentor from './Mentor';
import Feedback from './Feedback';
import Academic from './Academic';
import api from '../axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    api.get('/logout') // Fixed syntax: Added quotes
      .then((result) => {
        if (result.data.Status) {
          logout(); // Use context logout
          navigate('/');
        }
      })
      .catch((err) => console.log('Logout error:', err));
  };

  return (
    <div className="container-fluid p-0">
      <div className="bg-image-container">
        <img src={logo1} alt="Background" className="bg-vid" />
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            <img src={logo} alt="Logo" style={{ height: '50px', width: '250px' }} />
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Menus /></li>
              <li><Academic /></li>
              <li><TimeTable /></li>
              <li><Mentor /></li>
              <li><Feedback /></li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <ListItemButton component={Link} to="/dashboard/profile" className="nav-link">
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                </ListItemButton>
              </li>
              <li className="nav-item">
                <ListItemButton onClick={handleLogout} className="nav-link">
                  <ListItemIcon>
                    <ExitToAppIcon style={{ color: 'white', fontSize: '24px' }} />
                  </ListItemIcon>
                </ListItemButton>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          color: 'black',
          textAlign: 'right',
          padding: '0px 0',
        }}
      >
        <div>Developed By |||<sup>rd</sup> Year AIDA Students 2022-2026</div>
      </footer>

      <div className="col p-0 m-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
