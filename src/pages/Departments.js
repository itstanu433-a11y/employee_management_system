import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/apiService';
import '../styles/departments.css';
import DashboardHeader from '../components/DashboardHeader';
import DepartmentForm from '../components/DepartmentForm';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await departmentService.updateDepartment(editingId, data);
      } else {
        await departmentService.createDepartment(data);
      }
      fetchDepartments();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  return (
    <div className="departments-page">
      <DashboardHeader title="Departments" subtitle="Manage departments" />

      <div className="dept-toolbar">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <DepartmentForm
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="department-card">
              <h3>{dept.name}</h3>
              <p>
                <strong>Manager:</strong> {dept.manager}
              </p>
              <p>
                <strong>Employees:</strong> {dept.totalEmployees}
              </p>
              <div className="dept-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingId(dept.id);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(dept.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
