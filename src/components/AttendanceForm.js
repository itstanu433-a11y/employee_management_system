import React, { useState } from 'react';
import '../styles/components.css';

const AttendanceForm = ({ employees, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'employeeId' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label>Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <span className="error">{errors.employeeId}</span>
            )}
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
            {errors.status && <span className="error">{errors.status}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Mark Attendance
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;
