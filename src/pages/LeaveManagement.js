import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveService, employeeService } from '../services/apiService';
import { canApproveLeave } from '../utils/authorization';
import '../styles/leaves.css';

const LeaveManagement = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaveRes, employeeRes] = await Promise.all([
        leaveService.getAllLeaveRequests(),
        employeeService.getAllEmployees(),
      ]);

      setEmployees(employeeRes.data || []);

      // Filter leave requests based on user role
      let leaves = leaveRes.data || [];
      if (user.role === 'manager') {
        // Show only leave requests from department employees
        const departmentEmployees = employeeRes.data.filter(
          (emp) => emp.department === user.department
        );
        const deptEmployeeIds = departmentEmployees.map((emp) => emp.id);
        leaves = leaves.filter((leave) => deptEmployeeIds.includes(leave.employeeId));
      }

      setLeaveRequests(leaves);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await leaveService.approveLeaveRequest(leaveId, user.name);
      setSuccess('Leave request approved successfully');
      fetchData();
    } catch (err) {
      setError('Failed to approve leave request');
      console.error('Error approving leave:', err);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await leaveService.rejectLeaveRequest(leaveId, user.name);
      setSuccess('Leave request rejected');
      fetchData();
    } catch (err) {
      setError('Failed to reject leave request');
      console.error('Error rejecting leave:', err);
    }
  };

  const getEmployeeDepartment = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? emp.department : 'N/A';
  };

  const canApprove = (leave) => {
    const department = getEmployeeDepartment(leave.employeeId);
    return canApproveLeave(user.role, user.departmentId, department);
  };

  const filteredLeaves = leaveRequests.filter((leave) => {
    if (filterStatus === 'all') return true;
    return leave.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
    };
    return statusClasses[status] || 'badge-pending';
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="leave-management-container">
      <div className="leave-management-header">
        <h1>Leave Approvals</h1>
        <p>Manage and approve leave requests from your team</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading leave requests...</p>
      ) : filteredLeaves.length === 0 ? (
        <p className="empty-message">No leave requests found</p>
      ) : (
        <div className="leave-management-table">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employeeName}</td>
                  <td>{leave.leaveType}</td>
                  <td>
                    {leave.startDate} to {leave.endDate}
                    <br />
                    <span className="days-count">
                      ({calculateDays(leave.startDate, leave.endDate)} days)
                    </span>
                  </td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(leave.status)}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'pending' && canApprove(leave) ? (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(leave.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(leave.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : leave.status === 'pending' ? (
                      <span className="not-authorized">No action available</span>
                    ) : (
                      <span className="status-text">
                        {leave.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
