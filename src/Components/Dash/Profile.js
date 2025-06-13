import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axiosInstance";
import logo from "../../assets/Sret logo.png"; // Add your logo image path here
import { CircularProgress } from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const id = sessionStorage.getItem("loginId");
  useEffect(() => {
    // Get the user ID from Session Storage
    if (id) {
      //   console.log("ID from sessionStorage:", id); // Log the ID to check if it's correct
      api
        .get(`/auth5/profile/${id}`)
        .then((response) => {
          setProfile(response.data);
          //   console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("No ID found in sessionStorage");
      //   navigate("/"); // Redirect if no ID is found
    }
  }, [navigate]); // Only run on component mount

  const handleLogout = () => {
    api
      .get(`/logout`)
      .then((result) => {
        if (result.data.Status) {
          sessionStorage.removeItem("valid");
          sessionStorage.removeItem("loginId");
          sessionStorage.removeItem("roleId");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("loginTimestamp");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    // backgroundColor: '#f0f4f8',
    padding: "50px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "500px",
    padding: "50px",
    textAlign: "center",
  };

  const logoStyle = {
    width: "70%",
    marginBottom: "20px",
  };

  const headingStyle = {
    fontSize: "20px",
    color: "#333",
    margin: "10px 0",
  };

  const logoutBtnContainerStyle = {
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#ff5733",
    border: "none",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#ff3d00",
  };

  const handleCancel = () => {
    navigate("/dashboard"); 
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <div className="profile-info">
          {(profile.role === "SuperAdmin" || profile.role === "Admin") && (
            <div className="d-flex align-items-center flex-column mt-5">
              <h3 style={headingStyle}>LoginID: {id}</h3>
              <h3 style={headingStyle}>Username: {profile.username}</h3>
            </div>
          )}

          {profile.role === "Staff" && (
            <div className="d-flex align-items-center flex-column mt-5">
              <h3 style={headingStyle}>LoginID: {id}</h3>
              <h3 style={headingStyle}>
                Staff Code: {profile.details?.StaffCode}
              </h3>
              <h3 style={headingStyle}>
                First Name: {profile.details?.Firstname}
              </h3>
              <h3 style={headingStyle}>
                Last Name: {profile.details?.LastName}
              </h3>
            </div>
          )}

          {profile.role === "Student" && (
            <div className="d-flex align-items-center flex-column mt-5">
              <h3 style={headingStyle}>LoginID: {id}</h3>
              <h3 style={headingStyle}>UID: {profile.details?.uid}</h3>
              <h3 style={headingStyle}>
                First Name: {profile.details?.Firstname}
              </h3>
              <h3 style={headingStyle}>
                Last Name: {profile.details?.Lastname}
              </h3>
              <h3 style={headingStyle}>Email: {profile.details?.email}</h3>
            </div>
          )}

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
  <button
    style={{
      backgroundColor: '#007BFF', // Blue color for the logout button
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }}
    onClick={handleLogout}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
  >
    Logout
  </button>
  <button
    style={{
      backgroundColor: '#FF5733', // Orange color for the cancel button
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }}
    onClick={handleCancel}
    disabled={loader}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#cc4629')}
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF5733')}
  >
    {loader ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      "Cancel"
    )}
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
