import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './StudentCourses.css';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses', { position: 'top-center' });
    }
  };

  const handleRegister = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const studentId = localStorage.getItem('userId'); // ✅ make sure this exists

      console.log("📦 studentId from localStorage:", studentId);

      if (!studentId) {
        toast.error('Student ID missing. Please login again.', { position: 'top-center' });
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/courses/${course._id}/add-students`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const registrationId = res.data.registrationId;

      navigate('/student/course-confirmation', {
        state: {
          courseName: course.courseName,
          registrationId
        }
      });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', { position: 'top-center' });
    }
  };

  return (
    <div className="student-courses-container">
      <h2 className="student-courses-title">📘 Available Courses</h2>

      <div className="student-courses-grid">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
            courses.map(course => (
            <div className="student-course-card" key={course._id}>
                <img src={course.imageLink} alt="Course" className="course-image" />
                <h3>{course.courseName}</h3>
                <p><strong>Code:</strong> {course.courseCode}</p>
                <p>{course.description}</p>
                <button className="register-button" onClick={() => handleRegister(course)}>
                Register
                </button>
            </div>
            ))
        )}
        </div>
    </div>
    );
};

export default StudentCourses;
