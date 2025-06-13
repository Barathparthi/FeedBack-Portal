import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SHEET_URL = " ";

const StudentAttendance = () => {
  // Get loginId from localStorage with a fallback
  const loginId = localStorage.getItem("loginId") || "861";
  
  // State variables for attendance data
  const [presentDates, setPresentDates] = useState([]);
  const [absentDates, setAbsentDates] = useState([]);
  const [percentage, setPercentage] = useState("0.00");

  // Fetch data when component mounts or loginId changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetch data from Google Sheet
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response text
        const text = await response.text();
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const json = JSON.parse(text.substring(start, end + 1));

        // Extract rows and headers
        const rows = json.table.rows;
        const headers = json.table.cols.map((col) => col.label || "");
        const dateHeaders = headers.slice(2).map((date) => dayjs(date).format("YYYY-MM-DD"));

        // Find the student row matching the loginId
        const studentRow = rows.find((row) => row.c[0]?.v?.toString() === loginId);
        if (!studentRow) {
          console.warn(`No data found for loginId: ${loginId}`);
          return;
        }

        // Extract attendance statuses (P for present, A for absent)
        const statuses = studentRow.c.slice(2).map((cell) => cell?.v || "");
        const present = [];
        const absent = [];

        // Map statuses to dates
        statuses.forEach((status, index) => {
          const date = dateHeaders[index];
          if (date) {
            if (status === "P") present.push(date);
            else if (status === "A") absent.push(date);
          }
        });

        // Calculate percentage
        const totalDays = present.length + absent.length;
        const percent = totalDays > 0 ? ((present.length / totalDays) * 100).toFixed(2) : "0.00";

        // Update state
        setPresentDates(present);
        setAbsentDates(absent);
        setPercentage(percent);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (loginId) fetchAttendance();
  }, [loginId]);

  // Function to apply CSS classes to calendar tiles
  const tileClassName = ({ date }) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    if (presentDates.includes(formattedDate)) return "present-day";
    if (absentDates.includes(formattedDate)) return "absent-day";
    return null;
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Attendance Percentage: {percentage}%</h2>
      
      <Calendar
        tileClassName={tileClassName}
        defaultActiveStartDate={new Date(2025, 4, 1)} // Set to May 2025 for example
      />

      <h4>✅ Present Days: {presentDates.length}</h4>
      <ul>
        {presentDates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>

      <h4>❌ Absent Days: {absentDates.length}</h4>
      <ul>
        {absentDates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>

      <style>
        {`
          .present-day {
            background: #c8e6c9 !important;
            color: black;
          }
          .absent-day {
            background: #ffcdd2 !important;
            color: black;
          }
        `}
      </style>
    </div>
  );
};

export default StudentAttendance;