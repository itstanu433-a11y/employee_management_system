import React, { useState, useEffect } from 'react';
import { employeeService, departmentService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { canViewEmployee, canEditEmployee, canDeleteEmployee } from '../utils/authorization';
import '../styles/employees.css';
import DashboardHeader from '../components/DashboardHeader';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');

  // Fetch employees and departments
  const fetchData = async () => {
    setLoading(true);
    try {
      const empResponse = await employeeService.getAllEmployees();
      const deptResponse = await departmentService.getAllDepartments();
      let emps = empResponse.data;

      // Filter employees based on user role
      if (user?.role === 'manager') {
        // Managers can only see employees in their department
        emps = emps.filter(emp => emp.department === user.department);
        setFilterDept(user.department);
      }

      setEmployees(emps);
      setDepartments(deptResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !filterDept || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  // Handle add/edit
  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await employeeService.updateEmployee(editingId, data);
      } else {
        await employeeService.createEmployee(data);
      }
      fetchData();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (canDeleteEmployee(user?.role)) {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        try {
          await employeeService.deleteEmployee(id);
          fetchData();
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      }
    } else {
      alert('You do not have permission to delete employees');
    }
  };

  const canAdd = user?.role === 'ceo' || user?.role === 'manager';
  const canEdit = (emp) => canEditEmployee(user?.role, user?.departmentId, emp.departmentId);
  const canDelete = () => canDeleteEmployee(user?.role);

  return (
    <div className="employees-page">
      <DashboardHeader title="Employees" subtitle="Manage your workforce" />

      <div className="employees-toolbar">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="filter-select"
            disabled={user?.role === 'manager'}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        {canAdd && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Employee
          </button>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          departments={departments}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        userRole={user?.role}
        canEdit={canEdit}
        canDelete={canDelete()}
        onEdit={(emp) => {
          setEditingId(emp.id);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Employees;
