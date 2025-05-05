import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StudentCourses.css';

const StudentEnrolledCourses = () => {
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/courses/student/enrolled', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolled(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="student-courses-container">
      <h2 className="student-courses-title">🎓 My Enrolled Courses</h2>
      <div className="student-courses-grid">
        {enrolled.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          enrolled.map(course => (
            <div className="student-course-card" key={course._id}>
              <img src={course.imageLink} alt="Course" className="course-image" />
              <h3>{course.courseName}</h3>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Code:</strong> {course.courseCode}</p>
              <p>{course.description}</p>

              {/* ✅ View Content Button */}
              <Link to={`/student/course/${course._id}/content`}>
                <button className="view-course-button">📘 Start Course</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;
