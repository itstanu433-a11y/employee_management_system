import React, { useState } from 'react';
import '../styles/components.css';

const DepartmentForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    totalEmployees: 0,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Department name is required';
    if (!formData.manager) newErrors.manager = 'Manager name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalEmployees' ? parseInt(value) : value,
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
        <h2>Add Department</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter department name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Manager Name *</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Enter manager name"
            />
            {errors.manager && <span className="error">{errors.manager}</span>}
          </div>

          <div className="form-group">
            <label>Total Employees</label>
            <input
              type="number"
              name="totalEmployees"
              value={formData.totalEmployees}
              onChange={handleChange}
              placeholder="Enter total employees"
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Department
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

export default DepartmentForm;
