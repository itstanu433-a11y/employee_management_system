import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';
import { formatDate } from '../utils/helpers';

const EmployeeTable = ({ employees, loading, userRole, canEdit, canDelete, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = employees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="table-container">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      ) : (
        <>
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>#{emp.id}</td>
                    <td>
                      <strong 
                        style={{ cursor: 'pointer', color: '#667eea' }}
                        onClick={() => navigate(`/employee/${emp.id}`)}
                        title="Click to view profile"
                      >
                        {emp.name}
                      </strong>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>
                      <span
                        className={`status-badge status-${emp.status.toLowerCase()}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td>
                        <div className="action-buttons">
                          {canEdit(emp) && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onEdit(emp)}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => onDelete(emp.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit || canDelete ? "7" : "6"} className="no-data">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeTable;
