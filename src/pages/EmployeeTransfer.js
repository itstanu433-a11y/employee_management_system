import React, { useState, useEffect } from 'react';
import {
  employeeService,
  transferService,
  departmentService,
} from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/transfer.css';

const EmployeeTransfer = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fromDepartment: '',
    toDepartment: '',
    newDesignation: '',
    reason: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empResponse = await employeeService.getAllEmployees();
      setEmployees(empResponse.data || []);

      const deptResponse = await departmentService.getAllDepartments();
      setDepartments(deptResponse.data || []);

      const transferResponse = await transferService.getAllTransfers();
      setTransfers(transferResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.toDepartment ||
      !formData.newDesignation
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const employee = employees.find(
        (emp) => emp.id === parseInt(formData.employeeId)
      );

      const payload = {
        employeeId: parseInt(formData.employeeId),
        employeeName: employee.name,
        fromDepartment: employee.department,
        toDepartment: formData.toDepartment,
        oldDesignation: employee.designation,
        newDesignation: formData.newDesignation,
        transferDate: new Date().toISOString().split('T')[0],
        reason: formData.reason || 'Career development',
        transferredBy: user.name,
      };

      await transferService.createTransfer(payload);

      // Update employee department and designation
      await employeeService.updateEmployee(parseInt(formData.employeeId), {
        department: formData.toDepartment,
        designation: formData.newDesignation,
      });

      // Sync department counts
      await departmentService.syncDepartmentEmployeeCount();

      setFormData({
        employeeId: '',
        fromDepartment: '',
        toDepartment: '',
        newDesignation: '',
        reason: '',
      });
      setShowForm(false);
      fetchData();
      alert('Employee transfer completed successfully!');
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Error processing transfer');
    }
  };

  const handleDeleteTransfer = async (id) => {
    if (window.confirm('Are you sure you want to delete this transfer record?')) {
      try {
        await transferService.deleteTransfer(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting transfer:', error);
      }
    }
  };

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find((e) => e.id === parseInt(empId));
    if (emp) {
      setFormData((prev) => ({
        ...prev,
        employeeId: empId,
        fromDepartment: emp.department,
      }));
    }
  };

  const canTransferEmployee = user.role === 'manager' || user.role === 'ceo';

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h1>Employee Transfer Management</h1>
        {canTransferEmployee && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Transfer Employee'}
          </button>
        )}
      </div>

      {showForm && canTransferEmployee && (
        <div className="transfer-form-container">
          <h2>Transfer Employee to Different Department</h2>
          <form onSubmit={handleSubmitTransfer} className="transfer-form">
            <div className="form-group">
              <label htmlFor="employeeId">Employee *</label>
              <select
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fromDepartment">Current Department</label>
                <input
                  type="text"
                  id="fromDepartment"
                  value={formData.fromDepartment}
                  disabled
                  placeholder="Auto-filled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="toDepartment">New Department *</label>
                <select
                  id="toDepartment"
                  value={formData.toDepartment}
                  onChange={(e) =>
                    setFormData({ ...formData, toDepartment: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {departments
                    .filter(
                      (dept) => dept.name !== formData.fromDepartment
                    )
                    .map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newDesignation">New Designation *</label>
              <input
                type="text"
                id="newDesignation"
                value={formData.newDesignation}
                onChange={(e) =>
                  setFormData({ ...formData, newDesignation: e.target.value })
                }
                placeholder="e.g., Senior Manager"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Transfer Reason</label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Reason for transfer"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Process Transfer
            </button>
          </form>
        </div>
      )}

      <div className="transfer-section">
        <h2>Transfer History</h2>
        {loading ? (
          <div className="loading">Loading transfers...</div>
        ) : transfers.length === 0 ? (
          <p>No transfer records found</p>
        ) : (
          <div className="transfers-list">
            {transfers.map((transfer) => (
              <div key={transfer.id} className="transfer-card">
                <div className="transfer-employee">
                  <h3>{transfer.employeeName}</h3>
                  <p className="transfer-date">
                    {new Date(transfer.transferDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="transfer-details">
                  <div className="detail-item">
                    <strong>From</strong>
                    <p>{transfer.fromDepartment}</p>
                  </div>

                  <div className="arrow-icon">→</div>

                  <div className="detail-item">
                    <strong>To</strong>
                    <p>{transfer.toDepartment}</p>
                  </div>
                </div>

                <div className="role-change">
                  <div className="role-item">
                    <strong>Previous Role</strong>
                    <p>{transfer.oldDesignation}</p>
                  </div>

                  <div className="arrow">↓</div>

                  <div className="role-item">
                    <strong>New Role</strong>
                    <p>{transfer.newDesignation}</p>
                  </div>
                </div>

                {transfer.reason && (
                  <p className="reason">
                    <strong>Reason:</strong> {transfer.reason}
                  </p>
                )}

                <p className="transferred-by">
                  Transferred by: {transfer.transferredBy}
                </p>

                {canTransferEmployee && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTransfer(transfer.id)}
                  >
                    Delete Record
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTransfer;
