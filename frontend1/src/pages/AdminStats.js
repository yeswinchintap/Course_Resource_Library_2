import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/courses/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
      console.log("📊 Stats from backend:", res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  return (
    <div className="admin-stats-container">
      <h2>📊 Admin Analytics Dashboard</h2>

      {!stats ? (
        <p>Loading statistics...</p>
      ) : (
        <>
          <div className="admin-stats-cards">
            <div className="stat-card">
              <h3>Total Courses</h3>
              <p>{stats.totalCourses}</p>
            </div>
            <div className="stat-card">
              <h3>Total Registrations</h3>
              <p>{stats.totalRegistrations}</p>
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>📘 Course-wise Breakdown</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Registered</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {stats.completedPerCourse?.map((course, idx) => (
                <tr key={idx}>
                  <td>{course.courseName}</td>
                  <td>{course.registered}</td>
                  <td>{course.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminStats;
