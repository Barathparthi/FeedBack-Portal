import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SpecializationView = () => {
  const [specialization, setSpecialization] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleEdit = (id) => {
    // e.preventDefault()
    // axios.put('http://localhost:5000/academicyear'+id, academic)
    // .then(result => {
    //     if(result.data) {
    //         navigate('/dashboard/academic_year/academicview')
    //     } else {
    //         alert(result.data.Error)
    //     }
    // }).catch(err => console.log(err))
    console.log("Edit academic with ID:",id)
}
  const handleDelete = (id) => {
    // Handle delete operation, you can show a confirmation dialog before deleting
    console.log("Delete academic with ID:", id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1990 && date.getMonth() === 0 && date.getDate() === 1) {
      return '-';
    } else {
      const year = date.getFullYear();
      const month = date.toLocaleString('en-us', { month: 'short' }); // Get month as abbreviation (e.g., Apr)
      const day = String(date.getDate()).padStart(2, '0'); // Adding leading zero if needed
      return `${day} ${month} ${year}`;
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/specialization`)
      .then((result) => {
        if (result.data) {
          setSpecialization(result.data);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 style={{ color: "red" }}>List of Specialization Shown Below:-</h3>
      </div>
      <Link to="/dashboard/academic_year/specializationview" className="btn btn-success">
        Add Specialization
      </Link>
      <div className="mt-2">
        <table className="table">
          <thead>
            <tr>
              <th>Scode</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {specialization.map((c) => (
              <tr>
                <td style={{ color: "red" }}>
                  <b>{c.Scode}</b>
                </td>
                <td>
                  <b>{c.description}</b>
                </td>
                <td>
                  <b>{formatDate(c.StartDate)}</b>
                </td>
                <td>
                  <b>{formatDate(c.EndDate)}</b>
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(c.id)}>Edit</button>
                  <button className="btn btn-danger mx-2" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ backgroundColor: 'white', padding: '10px' }}>
  <div className="d-flex justify-content-center" style={{ alignItems: 'center', height: '35px' }}>
    <label>
      Page Size:
      <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))} className="form-control" style={{ height: '25px', fontSize: '12px' }}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={100}>100</option>
      </select>
    </label>{'\u00A0'}{'\u00A0'}{'\u00A0'}
    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-sm btn-success" style={{ padding: '2px 10px', fontSize: '12px' }}>
      Previous Page
    </button>
    <span className="mx-2" style={{ fontSize: '12px' }}>Page {currentPage}</span>
    <button onClick={() => setCurrentPage(currentPage + 1)} className="btn btn-sm btn-success" style={{ padding: '2px 10px', fontSize: '12px' }}>Next Page</button>
  </div>
</div>
    </div>
  );
};

export default SpecializationView;
