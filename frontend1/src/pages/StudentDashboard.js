import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { Link } from 'react-router-dom';


const StudentDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Student';

  return (
    <div className="student-dashboard-container">
      <h2 className="student-dashboard-title">Welcome, {username}! 👋</h2>

      <div className="student-dashboard-buttons">
        <button onClick={() => navigate('/student/books')}>
          📚 View Available Books
        </button>

        <button onClick={() => navigate('/search-books')}>
          🔍 Search Books
        </button>

        <button onClick={() => navigate('/student/courses')}>
        📘 View Courses
        </button>

        <Link to="/student/enrolled">
            <button className="dashboard-button">📘 View My Courses</button>
        </Link>


        {/* Later: Borrow history */}
        {/* <button onClick={() => navigate('/student/history')}>
          🧾 Borrowed Books
        </button> */}
      </div>
    </div>
  );
};

export default StudentDashboard;
