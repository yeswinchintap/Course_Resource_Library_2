import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import './AddCourse.css'; // reuse styling from AddCourse

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    imageLink: '',
    instructor: ''
  });

  useEffect(() => {
    // Load data from localStorage (optional fallback to API later)
    const storedCourse = JSON.parse(localStorage.getItem('editCourse'));
    if (storedCourse && storedCourse._id === courseId) {
      setCourseData({
        courseName: storedCourse.courseName || '',
        courseCode: storedCourse.courseCode || '',
        description: storedCourse.description || '',
        imageLink: storedCourse.imageLink || '',
        instructor: storedCourse.instructor || ''
      });
    } else {
      fetchCourseById(); // fallback if localStorage not present
    }
  }, [courseId]);

  const fetchCourseById = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const course = res.data;
      setCourseData({
        courseName: course.courseName,
        courseCode: course.courseCode,
        description: course.description,
        imageLink: course.imageLink,
        instructor: course.instructor
      });
    } catch (err) {
      toast.error("Failed to load course data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course updated successfully!');
      navigate('/admin/view-courses');
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleUpdate} className="add-course-form">
        <h2 className="add-course-title">✏️ Edit Course</h2>

        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={courseData.courseName}
          onChange={handleInputChange}
          className="add-course-input"
          required
        />

        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={courseData.courseCode}
          onChange={handleInputChange}
          className="add-course-input"
          required
        />

        <input
          type="text"
          name="instructor"
          placeholder="Instructor Name"
          value={courseData.instructor}
          onChange={handleInputChange}
          className="add-course-input"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={courseData.description}
          onChange={handleInputChange}
          className="add-course-textarea"
          rows="4"
          required
        />

        <input
          type="text"
          name="imageLink"
          placeholder="Image Link"
          value={courseData.imageLink}
          onChange={handleInputChange}
          className="add-course-input"
        />

        <button type="submit" className="add-course-button">
          ✅ Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
