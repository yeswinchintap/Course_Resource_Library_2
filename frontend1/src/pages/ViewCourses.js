import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './ViewCourses.css';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);

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
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to fetch courses!', { position: 'top-center' });
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Course deleted successfully!", { position: 'top-center' });
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete course", { position: 'top-center' });
    }
  };

  const handleEdit = (course) => {
    localStorage.setItem('editCourse', JSON.stringify(course)); // store course data
    window.location.href = `/admin/edit-course/${course._id}`; // navigate
  };

  return (
    <div className="view-courses-container">
      <h2 className="view-courses-title">📚 All Available Courses</h2>
      
      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No courses found!</p>
        ) : (
          courses.map((course) => (
            <div className="course-card" key={course._id}>
  {course.imageLink && (
    <img src={course.imageLink} alt="Course" className="course-image" />
  )}
  <h3>{course.courseName}</h3>
  <p><strong>Code:</strong> {course.courseCode}</p>
  <p><strong>Instructor:</strong> {course.instructor}</p>
  <p>{course.description}</p>

  {/* 🔷 Top Actions: Add Content + View Students */}
  <div className="course-actions-top">
    <Link to={`/admin/course/${course._id}/add-content`}>
      <button className="orange-button">➕ Add Content</button>
    </Link>
    <Link to={`/admin/course/${course._id}/students`}>
      <button className="orange-button">👥 View Students</button>
    </Link>
    <Link to={`/admin/course/${course._id}/add-quiz`}>
      <button className="orange-button">📝 Add Quiz</button>
    </Link>
  </div>

  {/* 🔷 Bottom Actions: Edit + Delete */}
  <div className="course-actions-bottom">
    <button className="edit-button" onClick={() => handleEdit(course)}>✏️ Edit</button>
    <button className="delete-button" onClick={() => handleDelete(course._id)}>🗑️ Delete</button>
  </div>
</div>

          ))
        )}
      </div>
    </div>
  );
};

export default ViewCourses;
