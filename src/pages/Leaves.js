import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveService } from '../services/apiService';
import '../styles/leaves.css';

const LeaveRequest = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'Casual Leave',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await leaveService.getLeaveRequestsByEmployeeId(user.id);
      setLeaveRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Reason is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        employeeId: user.id,
        employeeName: user.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: formData.leaveType,
        reason: formData.reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
      };

      await leaveService.createLeaveRequest(requestData);
      setSuccess('Leave request submitted successfully!');
      setFormData({
        startDate: '',
        endDate: '',
        leaveType: 'Casual Leave',
        reason: '',
      });
      setShowForm(false);
      fetchLeaveRequests();
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
      console.error('Error submitting leave request:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="leave-container">
      <div className="leave-header">
        <h1>Leave Management</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Request New Leave'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="leave-form-container">
          <form onSubmit={handleSubmit} className="leave-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="leaveType">Leave Type</label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                  <option>Maternity Leave</option>
                  <option>Paternity Leave</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide reason for leave"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      <div className="leave-list">
        <h2>My Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p className="empty-message">No leave requests yet</p>
        ) : (
          <div className="leave-cards">
            {leaveRequests.map((leave) => (
              <div key={leave.id} className="leave-card">
                <div className="leave-card-header">
                  <h3>{leave.leaveType}</h3>
                  <span className={`status-badge ${getStatusBadge(leave.status)}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </div>
                <div className="leave-card-body">
                  <p>
                    <strong>Duration:</strong> {leave.startDate} to {leave.endDate}
                    <span className="days-count">
                      ({calculateDays(leave.startDate, leave.endDate)} days)
                    </span>
                  </p>
                  <p>
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                  <p>
                    <strong>Requested On:</strong>{' '}
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </p>
                  {leave.approvedBy && (
                    <p>
                      <strong>Approved By:</strong> {leave.approvedBy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
