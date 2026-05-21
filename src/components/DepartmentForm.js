import React, { useState, useEffect } from 'react';
import { validateRequired, validateName } from '../utils/validators';
import { employeeService } from '../services/apiService';
import '../styles/components.css';

const DepartmentForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    description: '',
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };
    loadEmployees();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Department name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Department name can only contain letters and spaces';
    }
    
    if (!validateRequired(formData.managerId)) {
      newErrors.managerId = 'Manager is required';
    }

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
            <label>Manager *</label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
            >
              <option value="">Select a manager</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.managerId && <span className="error">{errors.managerId}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter department description"
              rows="3"
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
