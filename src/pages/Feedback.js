import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/feedback.css';

const Feedback = () => {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      let data;
      if (user.role === 'employee') {
        data = await feedbackService.getFeedbackByEmployee(user.id);
      } else if (user.role === 'manager') {
        data = await feedbackService.getFeedbackByDepartment(user.departmentId);
      } else {
        data = await feedbackService.getAllFeedback();
      }
      setFeedbackList(data.data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await feedbackService.createFeedback(feedbackData);
      setShowForm(false);
      fetchFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleResponse = async (feedbackId, response) => {
    try {
      await feedbackService.respondToFeedback(feedbackId, response);
      fetchFeedback();
    } catch (error) {
      console.error('Error responding to feedback:', error);
    }
  };

  const filteredFeedback = feedbackList.filter((fb) => {
    if (filter === 'all') return true;
    return fb.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>Feedback System</h1>
        {user.role === 'employee' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Submit Feedback'}
          </button>
        )}
      </div>

      {showForm && user.role === 'employee' && (
        <FeedbackForm onSubmit={handleFeedbackSubmit} />
      )}

      <div className="feedback-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'reviewed' ? 'active' : ''}`}
          onClick={() => setFilter('reviewed')}
        >
          Reviewed
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading feedback...</div>
      ) : filteredFeedback.length === 0 ? (
        <div className="no-data">No feedback found</div>
      ) : (
        <div className="feedback-list">
          {filteredFeedback.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <div className="feedback-header-info">
                <h3>{fb.employeeName}</h3>
                <span className={`status-badge ${fb.status.toLowerCase()}`}>
                  {fb.status}
                </span>
              </div>
              <div className="feedback-content">
                <p>
                  <strong>Category:</strong> {fb.feedbackCategory}
                </p>
                <p>
                  <strong>Rating:</strong> {fb.rating}/5
                </p>
                <p>
                  <strong>Feedback:</strong> {fb.message}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(fb.createdAt).toLocaleDateString()}
                </p>

                {fb.response && (
                  <div className="feedback-response">
                    <strong>Response:</strong>
                    <p>{fb.response}</p>
                    <p className="response-date">
                      Reviewed on{' '}
                      {new Date(fb.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {(user.role === 'manager' || user.role === 'ceo') &&
                  fb.status === 'Pending' && (
                    <div className="feedback-actions">
                      <textarea
                        id={`response-${fb.id}`}
                        placeholder="Write your response..."
                        rows="3"
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          const response = document.getElementById(
                            `response-${fb.id}`
                          ).value;
                          if (response.trim()) {
                            handleResponse(fb.id, response);
                          }
                        }}
                      >
                        Send Response
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
