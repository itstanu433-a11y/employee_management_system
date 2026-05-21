import React, { useState, useEffect } from 'react';
import { holidayService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/holidays.css';

const HolidayCalendar = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    fetchHolidays();
  }, [currentYear]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await holidayService.getHolidaysByYear(currentYear);
      setHolidays(response.data || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!newHoliday.name.trim() || !newHoliday.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const date = new Date(newHoliday.date);
      const payload = {
        name: newHoliday.name,
        date: newHoliday.date,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        description: newHoliday.description,
      };

      await holidayService.createHoliday(payload);
      setNewHoliday({ name: '', date: '', description: '' });
      setShowForm(false);
      fetchHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await holidayService.deleteHoliday(id);
        fetchHolidays();
      } catch (error) {
        console.error('Error deleting holiday:', error);
      }
    }
  };

  const currentMonthHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return (
      holidayDate.getMonth() === currentMonth &&
      holidayDate.getFullYear() === currentYear
    );
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="holiday-calendar-container">
      <div className="calendar-header">
        <h1>Company Holiday Calendar</h1>
        {(user.role === 'ceo' || user.role === 'admin') && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Holiday'}
          </button>
        )}
      </div>

      {showForm && (user.role === 'ceo' || user.role === 'admin') && (
        <div className="add-holiday-form">
          <h2>Add New Holiday</h2>
          <form onSubmit={handleAddHoliday}>
            <div className="form-group">
              <label htmlFor="name">Holiday Name *</label>
              <input
                type="text"
                id="name"
                value={newHoliday.name}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, name: e.target.value })
                }
                placeholder="e.g., New Year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                value={newHoliday.date}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={newHoliday.description}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, description: e.target.value })
                }
                placeholder="Holiday description"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Holiday
            </button>
          </form>
        </div>
      )}

      <div className="calendar-navigation">
        <button onClick={handlePrevMonth} className="nav-btn">
          ← Previous
        </button>
        <h2>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={handleNextMonth} className="nav-btn">
          Next →
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading holidays...</div>
      ) : currentMonthHolidays.length === 0 ? (
        <div className="no-holidays">No holidays in {monthNames[currentMonth]}</div>
      ) : (
        <div className="holidays-list">
          {currentMonthHolidays.map((holiday) => (
            <div key={holiday.id} className="holiday-card">
              <div className="holiday-date">
                <div className="date-number">
                  {new Date(holiday.date).getDate()}
                </div>
                <div className="day-name">{holiday.day}</div>
              </div>
              <div className="holiday-details">
                <h3>{holiday.name}</h3>
                {holiday.description && <p>{holiday.description}</p>}
                <p className="full-date">
                  {new Date(holiday.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {(user.role === 'ceo' || user.role === 'admin') && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteHoliday(holiday.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="all-holidays-section">
        <h2>All Holidays - {currentYear}</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : holidays.length === 0 ? (
          <p>No holidays configured for {currentYear}</p>
        ) : (
          <div className="holidays-table">
            <table>
              <thead>
                <tr>
                  <th>Holiday</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Description</th>
                  {(user.role === 'ceo' || user.role === 'admin') && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td>{holiday.name}</td>
                    <td>{holiday.date}</td>
                    <td>{holiday.day}</td>
                    <td>{holiday.description}</td>
                    {(user.role === 'ceo' || user.role === 'admin') && (
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;
