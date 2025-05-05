import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // External CSS

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Welcome, {username}! 🎉</h2>

      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => navigate('/admin/add-course')}>
          ➕ Add Course
        </button>

        <button className="dashboard-button" onClick={() => navigate('/admin/add-book')}>
          ➕ Add Book
        </button>

        <button className="dashboard-button" onClick={() => navigate('/admin/view-courses')}>
          📚 View Courses
        </button>

        <button className="dashboard-button" onClick={() => navigate('/admin/view-books')}>
          📚 View Books
        </button>

        <button className="dashboard-button" onClick={() => navigate('/admin/stats')}>
          📊 View Stats
        </button>

        
      </div>
    </div>
  );
};

export default AdminDashboard;
