import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  employeeService,
  leaveService,
  attendanceService,
  performanceService,
  salaryService,
  transferService,
} from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/employee-profile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      // Fetch employee basic info
      const empResponse = await employeeService.getEmployeeById(id);
      setEmployee(empResponse.data);

      // Fetch leave balance
      const leaveResponse = await leaveService.getLeaveBalance(id);
      setLeaveBalance(leaveResponse.data[0]);

      // Fetch performance reviews
      const perfResponse = await performanceService.getReviewsByEmployee(id);
      setPerformanceData(perfResponse.data || []);

      // Fetch salary history
      const salaryResponse = await salaryService.getSalaryHistoryByEmployee(id);
      setSalaryHistory(salaryResponse.data || []);

      // Fetch transfer history
      const transferResponse = await transferService.getTransfersByEmployee(id);
      setTransferHistory(transferResponse.data || []);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading employee profile...</div>;
  if (!employee) return <div className="no-data">Employee not found</div>;

  return (
    <div className="employee-profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{employee.name}</h1>
          <p className="designation">{employee.designation}</p>
          <p className="department">Department: {employee.department}</p>
        </div>
        <div className="profile-status">
          <span className={`status-badge ${employee.status.toLowerCase()}`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal
        </button>
        <button
          className={`tab ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave Balance
        </button>
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`tab ${activeTab === 'salary' ? 'active' : ''}`}
          onClick={() => setActiveTab('salary')}
        >
          Salary
        </button>
        <button
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfers
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="tab-content">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{employee.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{employee.phone}</p>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <p>{employee.gender}</p>
              </div>
              <div className="info-item">
                <label>Joining Date</label>
                <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Current Salary</label>
                <p>₹{employee.salary.toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Performance Rating</label>
                <p>⭐ {employee.performanceRating}/5</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="tab-content">
            <h2>Leave Balance</h2>
            {leaveBalance ? (
              <div className="leave-balance-grid">
                <div className="leave-card">
                  <h3>Sick Leave</h3>
                  <div className="leave-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(leaveBalance.sickLeave / leaveBalance.totalLeave) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    {leaveBalance.sickLeave} / {leaveBalance.totalLeave} days
                  </p>
                </div>
                <div className="leave-card">
                  <h3>Casual Leave</h3>
                  <div className="leave-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(leaveBalance.casualLeave / leaveBalance.totalLeave) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    {leaveBalance.casualLeave} / {leaveBalance.totalLeave} days
                  </p>
                </div>
                <div className="leave-card">
                  <h3>Privilege Leave</h3>
                  <div className="leave-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(leaveBalance.privilegeLeave / leaveBalance.totalLeave) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    {leaveBalance.privilegeLeave} / {leaveBalance.totalLeave} days
                  </p>
                </div>
                <div className="leave-card total">
                  <h3>Total Leave Used</h3>
                  <p>{leaveBalance.usedLeave} days</p>
                  <p className="remaining">
                    Remaining: {leaveBalance.remainingLeave} days
                  </p>
                </div>
              </div>
            ) : (
              <p>No leave balance information available</p>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="tab-content">
            <h2>Performance Reviews</h2>
            {performanceData.length > 0 ? (
              <div className="performance-list">
                {performanceData.map((perf) => (
                  <div key={perf.id} className="performance-card">
                    <div className="perf-header">
                      <h3>Review - {perf.year}</h3>
                      <span className="rating">⭐ {perf.rating}/5</span>
                    </div>
                    <p>
                      <strong>Reviewed by:</strong> {perf.reviewerName}
                    </p>
                    <p>
                      <strong>Manager Comments:</strong> {perf.comments}
                    </p>
                    <p>
                      <strong>CEO Remarks:</strong> {perf.ceoRemarks}
                    </p>
                    <p className="review-date">
                      {new Date(perf.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No performance reviews available</p>
            )}
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="tab-content">
            <h2>Salary History</h2>
            {salaryHistory.length > 0 ? (
              <div className="salary-history-list">
                {salaryHistory.map((history) => (
                  <div key={history.id} className="salary-card">
                    <div className="salary-row">
                      <span>Old Salary</span>
                      <strong>₹{history.oldSalary.toLocaleString()}</strong>
                    </div>
                    <div className="salary-row highlight">
                      <span>New Salary</span>
                      <strong>₹{history.newSalary.toLocaleString()}</strong>
                    </div>
                    <div className="salary-row">
                      <span>Increment</span>
                      <strong className="increment">
                        +₹{history.increment.toLocaleString()}
                      </strong>
                    </div>
                    <p>
                      <strong>Effective Date:</strong>{' '}
                      {new Date(history.effectiveDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {history.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No salary history available</p>
            )}
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="tab-content">
            <h2>Transfer History</h2>
            {transferHistory.length > 0 ? (
              <div className="transfer-list">
                {transferHistory.map((transfer) => (
                  <div key={transfer.id} className="transfer-card">
                    <div className="transfer-path">
                      <span>{transfer.fromDepartment}</span>
                      <span className="arrow">→</span>
                      <span>{transfer.toDepartment}</span>
                    </div>
                    <div className="transfer-roles">
                      <p>
                        <strong>From:</strong> {transfer.oldDesignation}
                      </p>
                      <p>
                        <strong>To:</strong> {transfer.newDesignation}
                      </p>
                    </div>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(transfer.transferDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {transfer.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No transfer history available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
