import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import api from "../../axiosInstance";
import { checkPermissions } from "../../Helper/RolePermission";

const BuildingView = () => {
  const [building, setBuilding] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [roleId, setRoleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoleId = parseInt(localStorage.getItem('roleId'), 10);
    setRoleId(storedRoleId);
  }, []);

  // Fetch data when currentPage or pageSize changes
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth2/building?page=${currentPage}&pageSize=${pageSize}`)
      .then((result) => {
        // console.log(result.data); // Check API response in the console
        if (result.data.building) {
          setBuilding(result.data.building); // Set batch data
          setTotalPages(result.data.totalPages); // Set total pages
          setTotalRecords(result.data.totalRecords); // Set total records
        } else {
          alert(result.data.error || "Error fetching data");
        }
        setIsLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, [currentPage, pageSize]);

  const handleEdit = (id) => {
    navigate(`/dashboard/building/edit/${id}`);
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

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this building record?")
    ) {
      api
        .delete(`/auth/building/${id}`)
        .then((result) => {
          if (result.data) {
            setBuilding(building.filter((item) => item.id !== id)); // Remove deleted batch from state
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

  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of Building Shown Below:</h3>
      </div>
      {permissions.canAdd && (
        <Link to="/dashboard/building/add" className="btn btn-success">
          Add Building
        </Link>
      )}

      {/* Batch Table */}
      <div className="mt-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  {permissions.canEdit && <TableCell>Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(building) && building.length > 0 ? (
                  building.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell style={{ color: "red" }}>
                        <b>{c.code}</b>
                      </TableCell>
                      <TableCell>
                        <b>{c.name}</b>
                      </TableCell>
                      <TableCell>
                        {permissions.canEdit && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(c.id)}
                            style={{ marginRight: "8px" }}
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
                    <TableCell colSpan={3} align="center">
                      No building available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Pagination Controls */}
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

export default BuildingView;
