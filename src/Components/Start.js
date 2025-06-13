import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Sret w.png";
import BgVideo from "../assets/Back1.mp4";

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/verify`)
  //     .then((result) => {
  //       if (result.data.Status) {
  //         if (result.data.role === "admin") {
  //           navigate("/dashboard");
  //         } else {
  //           navigate("/employee_detail/" + result.data.id);
  //         }
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <video autoPlay loop muted className="bg-vid">
          <source src={BgVideo} type="video/mp4" />
        </video>
        <div
          className="p-2 rounded w-25 border loginForm"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: "100%", width: "100%" }} />
          {/* <h2 className="text-center" style={{ color: "yellow" }}>
            Login as:
          </h2> */}
          <div className="text-center">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                navigate("/adminlogin");
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      {/* <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          color: "black",
          textAlign: "center",
          padding: "10px 0",
        }}
      >
        {/* <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p> 
        <div>Developed By SRET ERP {new Date().getFullYear()}</div>
      </footer> */}
    </div>
  );
};

export default Start;
