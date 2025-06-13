import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import api from "../axiosInstance";
import { checkPermissions } from "../Helper/RolePermission";

const AcademicView = () => {
  const [academic, setAcademic] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [roleId, setRoleId] = useState(null); // State to hold roleId

  const navigate = useNavigate();

  // Get roleId from localStorage/sessionStorage when component mounts
  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);

  // Fetch data when currentPage or pageSize changes
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth/academicyear?page=${currentPage}&pageSize=${pageSize}`)
      .then((result) => {
        if (result.data.academices) {
          setAcademic(result.data.academices);
          setTotalPages(result.data.totalPages);
          setTotalRecords(result.data.totalRecords);
        } else {
          alert(result.data.error || "Error fetching data");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, [currentPage, pageSize]);

  const handleEdit = (id) => {
    navigate(`/dashboard/academic/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this academic record?")
    ) {
      api
        .delete(`/auth/academicyear/${id}`)
        .then((result) => {
          if (result.data) {
            setAcademic(academic.filter((item) => item.id !== id));
            alert("Record deleted successfully!");
          } else {
            alert("Failed to delete the record.");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (
      date.getFullYear() === 1990 &&
      date.getMonth() === 0 &&
      date.getDate() === 1
    ) {
      return "-";
    } else {
      const year = date.getFullYear();
      const month = date.toLocaleString("en-us", { month: "short" });
      const day = String(date.getDate()).padStart(2, "0");
      return `${day} ${month} ${year}`;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get the permissions for the current roleId
  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of Academics Shown Below:-</h3>
      </div>
      {permissions.canAdd && (
        <Link to="/dashboard/academic/add" className="btn btn-success">
          Add Academic
        </Link>
      )}
      <div className="mt-2">
        {isLoading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Code</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  <TableCell>
                    <b>Starting Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Ending Date</b>
                  </TableCell>
                  {permissions.canEdit && (
                    <TableCell>
                      <b>Action</b>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(academic) && academic.length > 0 ? (
                  academic.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell style={{ color: "red" }}>
                        <b>{c.code}</b>
                      </TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>{formatDate(c.StartDate)}</TableCell>
                      <TableCell>{formatDate(c.EndDate)}</TableCell>
                      <TableCell>
                        {permissions.canEdit && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(c.id)}
                            style={{ marginRight: 8 }}
                          >
                            Edit
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No Academics available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      {/* <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          position: "relative",
        }}
      > */}
        <div
          className="d-flex justify-content-center"
          style={{
            alignItems: "center",
            height: "35px",
            position: "fixed",
            bottom: "0",
            width: "100%",
          }}
        >
          <div>Page Size:</div>
          <label style={{ position: "relative", display: "inline-block" }}>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="form-control"
              style={{
                height: "30px",
                fontSize: "12px",
                appearance: "none",
                paddingRight: "25px",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
            <ArrowDropDownIcon
              style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </label>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn btn-sm btn-success"
            style={{ padding: "5px 6px", fontSize: "12px" }}
          >
            Previous Page
          </button>
          <span className="mx-2" style={{ fontSize: "12px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="btn btn-sm btn-success"
            style={{ padding: "5px 6px", fontSize: "12px" }}
          >
            Next Page
          </button>
        </div>
      {/* </div> */}
    </div>
  );
};

export default AcademicView;