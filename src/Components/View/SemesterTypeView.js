import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import api from "../axiosInstance";
import { checkPermissions } from "../Helper/RolePermission";

const SemesterTypeView = () => {
  const [semestertype, setSemesterType] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [roleId, setRoleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoleId = parseInt(sessionStorage.getItem('roleId'), 10);
    setRoleId(storedRoleId);
  }, []);

  // Fetch data when currentPage or pageSize changes
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/auth/semtype?page=${currentPage}&pageSize=${pageSize}`)
      .then((result) => {
        // console.log(result.data); // Check API response in the console
        if (result.data.semtypes) {
          setSemesterType(result.data.semtypes); // Set batch data
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
    navigate(`/dashboard/semtype/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this semester type record?"
      )
    ) {
      api
        .delete(`/auth/semtype/${id}`)
        .then((result) => {
          if (result.data) {
            setSemesterType(semestertype.filter((item) => item.id !== id)); // Remove deleted batch from state
            alert("Record deleted successfully!");
          } else {
            alert("Failed to delete the record.");
          }
        })
        .catch((err) => console.log(err));
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

  const permissions = checkPermissions(roleId);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of SemesterTypes Shown Below:-</h3>
      </div>
      {permissions.canAdd && (
        <Link to="/dashboard/semtype/add" className="btn btn-success">
          Add SemesterType
        </Link>
      )}

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
                {Array.isArray(semestertype) && semestertype.length > 0 ? (
                  semestertype.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell style={{ color: "red" }}>
                        <b>{c.code}</b>
                      </TableCell>
                      <TableCell>
                        <b>{c.name}</b>
                      </TableCell>
                      <TableCell>
                        {permissions.canEdit && (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(c.id)}
                          >
                            Edit
                          </button>
                        )}
                        {permissions.canDelete && (
                          <button
                            className="btn btn-danger mx-2"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No batches available
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

export default SemesterTypeView;
