import React, { useState, useEffect } from "react";
import bgpic from "../../assets/Sriher_logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LightPurpleButton } from "../buttonStyles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axiosInstance";

const defaultTheme = createTheme();

const AcademicYear = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const clearMessages = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    const formData = {
      code: event.target.code.value,
      name: event.target.name.value,
      description: event.target.description.value,
      startdate: startDate,
      enddate: endDate,
    };

    try {
      const response = await api.post(`/auth/academicyear`, formData);
      if (response.status === 200) {
        console.log("Form data submitted successfully:", response.data);
        setSuccessMsg("Academic year registered successfully!");
        // setTimeout(clearMessages, 5000); // Clear message after 10 seconds
        setTimeout(() => {
          navigate("/dashboard/academic");
        }, 1500);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg(
          "Duplicate entry: the provided code or name already exists."
        );
      } else {
        setErrorMsg("Failed to register academic year. Please try again!");
      }
      setTimeout(clearMessages, 5000); // Clear message after 10 seconds
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/academic");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "80vh",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item md={6} component={Paper} elevation={6} square>
          <div className="d-flex justified-content-center align-items-center mt-3">
            <Box
              sx={{ my: 4, mx: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h4" align="center">
                Academic Year
              </Typography>
              <Typography variant="h6" color="text.primary" align="center">
                Please Enter Academic Year Details in the below Textfield!...
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 2, width: "100%" }}
              >
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Code"
                  name="code"
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="off"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="off"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startdate"
                  label="Starting Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="enddate"
                  label="Ending Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Button type="submit" variant="contained" disabled={loader}>
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Register"
                    )}
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                    disabled={loader}
                  >
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default AcademicYear;

// import React, { useState } from "react";
// import bgpic from "../../assets/Sriher_logo.jpg";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Grid,
//   Box,
//   Typography,
//   Paper,
//   TextField,
//   CircularProgress,
//   Alert,
//   Button
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { purple, teal, grey, amber } from "@mui/material/colors";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: teal[600],
//       contrastText: "#fff",
//     },
//     secondary: {
//       main: purple[500],
//       contrastText: "#fff",
//     },
//     background: {
//       default: grey[50],
//       paper: "#fff",
//     },
//     error: {
//       main: amber[700],
//     },
//   },
//   typography: {
//     fontFamily: "Roboto, sans-serif",
//     h4: {
//       fontWeight: 600,
//       color: teal[700],
//       letterSpacing: "0.5px",
//     },
//     h6: {
//       color: grey[700],
//       fontWeight: 500,
//     },
//     body1: {
//       color: grey[800],
//       lineHeight: 1.6,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 20,
//           padding: "10px 20px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
//           textTransform: "none",
//           fontWeight: 600,
//         },
//         containedPrimary: {
//           backgroundColor: teal[600],
//           "&:hover": {
//             backgroundColor: teal[700],
//           },
//         },
//         containedSecondary: {
//           backgroundColor: purple[500],
//           "&:hover": {
//             backgroundColor: purple[700],
//           },
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiInputLabel-root": {
//             color: grey[600],
//             fontWeight: 500,
//           },
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 12,
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: teal[600],
//               boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
//             },
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           padding: "20px",
//           borderRadius: "16px",
//           boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.2)",
//         },
//       },
//     },
//     MuiAlert: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           fontSize: "0.95rem",
//           padding: "10px 20px",
//           fontWeight: 500,
//         },
//       },
//     },
//   },
// });

// const AcademicYear = () => {
//   const navigate = useNavigate();
//   const [loader, setLoader] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [formErrors, setFormErrors] = useState({});

//   const clearMessages = () => {
//     setSuccessMsg("");
//     setErrorMsg("");
//   };

//   const validateForm = (formData) => {
//     const errors = {};
//     if (!formData.code) errors.code = "Code is required.";
//     if (!formData.name) errors.name = "Name is required.";
//     if (!formData.description) errors.description = "Description is required.";
//     if (!startDate) errors.startDate = "Start date is required.";
//     if (!endDate) errors.endDate = "End date is required.";
//     else if (new Date(endDate) <= new Date(startDate)) {
//       errors.endDate = "End date should be after start date.";
//     }
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     clearMessages();
//     const formData = {
//       code: event.target.code.value,
//       name: event.target.name.value,
//       description: event.target.description.value,
//       startdate: startDate,
//       enddate: endDate,
//     };

//     if (!validateForm(formData)) return;

//     setLoader(true);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/auth/academicyear`,
//         formData
//       );
//       if (response.status === 200) {
//         setSuccessMsg("Academic year registered successfully!");
//         setTimeout(() => {
//           navigate("/dashboard/academic_year");
//         }, 1500);
//       } else {
//         throw new Error("Unexpected server response");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         setErrorMsg("Duplicate entry: the provided code or name already exists.");
//       } else {
//         setErrorMsg("Failed to register academic year. Please try again!");
//       }
//       setTimeout(clearMessages, 5000);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/dashboard/academic_year");
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Grid
//         container
//         justifyContent="center"
//         alignItems="center"
//         sx={{
//           height: "100vh",
//           backgroundImage: `url(${bgpic})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <Grid item md={6} component={Paper} elevation={6} square>
//           <Box sx={{ my: 0, mx: 4, display: "flex", flexDirection: "column" }}>
//             <Typography variant="h4" align="center" color="primary">
//               Academic Year
//             </Typography>
//             <Typography variant="h6" color="text.primary" align="center">
//               Please enter academic year details below.
//             </Typography>
//             <Box
//               component="form"
//               noValidate
//               onSubmit={handleSubmit}
//               sx={{ mt: 2, width: "100%" }}
//             >
//               {successMsg && <Alert severity="success">{successMsg}</Alert>}
//               {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="code"
//                 label="Code"
//                 name="code"
//                 error={!!formErrors.code}
//                 helperText={formErrors.code}
//                 autoFocus
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="name"
//                 label="Name"
//                 name="name"
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="description"
//                 label="Description"
//                 name="description"
//                 error={!!formErrors.description}
//                 helperText={formErrors.description}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="startdate"
//                 label="Starting Date"
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 error={!!formErrors.startDate}
//                 helperText={formErrors.startDate}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="enddate"
//                 label="Ending Date"
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 error={!!formErrors.endDate}
//                 helperText={formErrors.endDate}
//               />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   mt: 3,
//                   mb: 2,
//                 }}
//               >
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   disabled={loader}
//                 >
//                   {loader ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "Register"
//                   )}
//                 </Button>

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleCancel}
//                   disabled={loader}
//                 >
//                   {loader ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "Cancel"
//                   )}
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default AcademicYear;
