import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateRequired } from '../utils/validators';

const FeedbackForm = ({ onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: 'Work Environment',
    message: '',
    rating: 3,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Work Environment',
    'Management',
    'Salary & Benefits',
    'Work-Life Balance',
    'Suggestions',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
    }
    if (formData.message.length < 10) {
      newErrors.message = 'Feedback must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const feedbackPayload = {
      employeeId: user.id,
      employeeName: user.name,
      departmentId: user.departmentId,
      feedbackCategory: formData.category,
      message: formData.message,
      rating: parseInt(formData.rating),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      response: null,
    };

    onSubmit(feedbackPayload);
    setFormData({
      category: 'Work Environment',
      message: '',
      rating: 3,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="feedback-form-container">
      <h2>Submit Your Feedback</h2>
      {submitted && (
        <div className="alert alert-success">
          Feedback submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="category">Feedback Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating (1-5) *</label>
          <div className="rating-input">
            <input
              type="range"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
            />
            <span className="rating-value">{formData.rating}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Feedback *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please share your feedback (minimum 10 characters)"
            rows="5"
          />
          {errors.message && <span className="error">{errors.message}</span>}
          <small>
            {formData.message.length}/500 characters
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
