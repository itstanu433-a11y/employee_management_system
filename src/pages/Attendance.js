import React, { useState, useEffect } from 'react';
import { attendanceService, employeeService } from '../services/apiService';
import '../styles/attendance.css';
import DashboardHeader from '../components/DashboardHeader';
import AttendanceForm from '../components/AttendanceForm';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const attResponse = await attendanceService.getAllAttendance();
      const empResponse = await employeeService.getAllEmployees();
      setAttendance(attResponse.data);
      setEmployees(empResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      await attendanceService.markAttendance(data);
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const filteredAttendance = attendance.filter((rec) => {
    return rec.date.startsWith(selectedMonth);
  });

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.id === empId);
    return emp ? emp.name : 'Unknown';
  };

  return (
    <div className="attendance-page">
      <DashboardHeader title="Attendance" subtitle="Track employee attendance" />

      <div className="attendance-toolbar">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-picker"
        />
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Mark Attendance
        </button>
      </div>

      {showForm && (
        <AttendanceForm
          employees={employees}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{getEmployeeName(record.employeeId)}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`status-badge status-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No attendance records for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
