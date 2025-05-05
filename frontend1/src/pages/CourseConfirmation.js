import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CourseConfirmation.css';

const CourseConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, registrationId } = location.state || {};
  const username = localStorage.getItem('username');

  if (!courseName || !registrationId) {
    return (
      /*<div className="confirmation-container">
        <div className="confirmation-box">
          <h2>⚠️ Missing confirmation details</h2>
          <button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</button>
        </div>
      </div> */
      <div style={{ padding: '40px', textAlign: 'center' }}>
      <h3>⚠️ Missing confirmation data</h3>
      <p>Try registering again or check your backend response.</p>
    </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-box">
        <div className="checkmark">✅</div>
        <h2>Registration Confirmed!</h2>
        <p><strong>Student:</strong> {username}</p>
        <p><strong>Course:</strong> {courseName}</p>
        <p><strong>Registration ID:</strong> <code>{registrationId}</code></p>
        <p className="note">📧 A confirmation email has been sent to your registered email address.</p>
        <button className="back-button" onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CourseConfirmation;
