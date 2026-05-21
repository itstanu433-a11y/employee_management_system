import React, { useState, useEffect } from 'react';
import {
  performanceService,
  employeeService,
  salaryService,
} from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/performance.css';

const PerformanceReview = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    employeeId: '',
    rating: 3,
    comments: '',
    ceoRemarks: '',
  });
  const [salaryIncrement, setSalaryIncrement] = useState({
    showForm: false,
    employeeId: '',
    oldSalary: '',
    newSalary: '',
    reason: 'Performance based increment',
  });

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const reviewsResponse = await performanceService.getReviewsByYear(
        selectedYear
      );
      setReviews(reviewsResponse.data || []);

      const empResponse = await employeeService.getAllEmployees();
      setEmployees(empResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.rating || !formData.comments) {
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
        reviewerName: user.name,
        reviewDate: new Date().toISOString().split('T')[0],
        rating: parseInt(formData.rating),
        comments: formData.comments,
        ceoRemarks: user.role === 'ceo' ? formData.ceoRemarks : '',
        year: selectedYear,
      };

      await performanceService.createReview(payload);
      setFormData({
        employeeId: '',
        rating: 3,
        comments: '',
        ceoRemarks: '',
      });
      setShowForm(false);
      fetchData();
      alert('Performance review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const handleApplySalaryIncrement = async () => {
    if (
      !salaryIncrement.employeeId ||
      !salaryIncrement.newSalary ||
      !salaryIncrement.oldSalary
    ) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        employeeId: parseInt(salaryIncrement.employeeId),
        oldSalary: parseInt(salaryIncrement.oldSalary),
        newSalary: parseInt(salaryIncrement.newSalary),
        increment: parseInt(salaryIncrement.newSalary) - parseInt(salaryIncrement.oldSalary),
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: salaryIncrement.reason,
        approvedBy: user.name,
      };

      await salaryService.addSalaryIncrement(payload);

      // Update employee salary
      await employeeService.updateEmployee(parseInt(salaryIncrement.employeeId), {
        salary: parseInt(salaryIncrement.newSalary),
      });

      setSalaryIncrement({
        showForm: false,
        employeeId: '',
        oldSalary: '',
        newSalary: '',
        reason: 'Performance based increment',
      });
      alert('Salary increment applied successfully!');
    } catch (error) {
      console.error('Error applying salary increment:', error);
      alert('Error applying salary increment');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await performanceService.deleteReview(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const canSubmitReview = user.role === 'manager' || user.role === 'ceo';
  const canApplySalary = user.role === 'ceo';

  return (
    <div className="performance-review-container">
      <div className="review-header">
        <h1>Performance Review & Salary Management</h1>
        {canSubmitReview && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Review'}
          </button>
        )}
      </div>

      <div className="year-selector">
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {[2023, 2024, 2025, 2026, 2027].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {showForm && canSubmitReview && (
        <div className="review-form-container">
          <h2>Add Performance Review</h2>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label htmlFor="employeeId">Employee *</label>
              <select
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1-5) *</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`rating-btn ${formData.rating === r ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, rating: r })}
                  >
                    {'⭐'.repeat(r)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments *</label>
              <textarea
                id="comments"
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Performance review comments"
                rows="4"
              />
            </div>

            {user.role === 'ceo' && (
              <div className="form-group">
                <label htmlFor="ceoRemarks">CEO Remarks</label>
                <textarea
                  id="ceoRemarks"
                  value={formData.ceoRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, ceoRemarks: e.target.value })
                  }
                  placeholder="CEO final remarks"
                  rows="3"
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      )}

      {canApplySalary && (
        <div className="salary-increment-section">
          <button
            className="btn btn-info"
            onClick={() =>
              setSalaryIncrement({
                ...salaryIncrement,
                showForm: !salaryIncrement.showForm,
              })
            }
          >
            {salaryIncrement.showForm ? 'Cancel' : 'Apply Salary Increment'}
          </button>

          {salaryIncrement.showForm && (
            <div className="salary-form">
              <h3>Apply Salary Increment</h3>
              <div className="form-group">
                <label htmlFor="salEmpId">Employee</label>
                <select
                  id="salEmpId"
                  value={salaryIncrement.employeeId}
                  onChange={(e) =>
                    setSalaryIncrement({
                      ...salaryIncrement,
                      employeeId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="oldSal">Old Salary</label>
                  <input
                    type="number"
                    id="oldSal"
                    value={salaryIncrement.oldSalary}
                    onChange={(e) =>
                      setSalaryIncrement({
                        ...salaryIncrement,
                        oldSalary: e.target.value,
                      })
                    }
                    placeholder="Current salary"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newSal">New Salary</label>
                  <input
                    type="number"
                    id="newSal"
                    value={salaryIncrement.newSalary}
                    onChange={(e) =>
                      setSalaryIncrement({
                        ...salaryIncrement,
                        newSalary: e.target.value,
                      })
                    }
                    placeholder="New salary"
                  />
                </div>
              </div>

              {salaryIncrement.oldSalary && salaryIncrement.newSalary && (
                <p className="increment-info">
                  Increment: ₹
                  {(
                    parseInt(salaryIncrement.newSalary) -
                    parseInt(salaryIncrement.oldSalary)
                  ).toLocaleString()}
                </p>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleApplySalaryIncrement}
              >
                Apply Increment
              </button>
            </div>
          )}
        </div>
      )}

      <div className="reviews-section">
        <h2>Performance Reviews - {selectedYear}</h2>
        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p>No performance reviews for {selectedYear}</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header-info">
                  <h3>{review.employeeName}</h3>
                  <span className="rating">⭐ {review.rating}/5</span>
                </div>
                <p>
                  <strong>Reviewed by:</strong> {review.reviewerName}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(review.reviewDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Comments:</strong> {review.comments}
                </p>
                {review.ceoRemarks && (
                  <p>
                    <strong>CEO Remarks:</strong> {review.ceoRemarks}
                  </p>
                )}
                {canSubmitReview && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
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

export default PerformanceReview;
