import { ArrowDropDown } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import api from "../axiosInstance";
import { checkPermissions } from "../Helper/RolePermission";

const BatchView = () => {
  const [batch, setBatch] = useState([]); // Array for batch data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [roleId, setRoleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem("roleId"), 10);
    setRoleId(storedRoleId);
  }, []);

  // Fetch data when currentPage or pageSize changes
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth/batch?page=${currentPage}&pageSize=${pageSize}`)
      .then((result) => {
        // console.log(result.data); // Check API response in the console
        if (result.data.batches) {
          setBatch(result.data.batches); // Set batch data
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
    navigate(`/dashboard/batch/edit/${id}`);
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
    if (window.confirm("Are you sure you want to delete this batch record?")) {
      api
        .delete(`/auth/batch/${id}`)
        .then((result) => {
          if (result.data) {
            setBatch(batch.filter((item) => item.id !== id)); // Remove deleted batch from state
            alert("Record deleted successfully!");
          } else {
            alert("Failed to delete the record.");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of Batches Shown Below:</h3>
      </div>
      {permissions.canAdd && (
        <Link to="/dashboard/batch/add" className="btn btn-success">
          Add Batch
        </Link>
      )}

      {/* Batch Table */}
      <div className="mt-2">
        {isLoading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Batch Code</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  {permissions.canEdit && (
                    <TableCell>
                      <b>Action</b>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(batch) && batch.length > 0 ? (
                  batch.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell style={{ color: "red" }}>
                        <b>{c.Bcode}</b>
                      </TableCell>
                      <TableCell>
                        <b>{c.description}</b>
                      </TableCell>
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
                    <TableCell colSpan={3} align="center">
                      No batches available
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

export default BatchView;
