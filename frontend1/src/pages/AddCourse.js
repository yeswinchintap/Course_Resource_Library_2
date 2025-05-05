import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddCourse.css'; // External CSS

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [instructor, setInstructor] = useState('');
  const navigate = useNavigate();

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/courses', 
        { courseName, courseCode, description, imageLink , instructor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Course added successfully!', { position: 'top-center' });
      navigate('/admin/view-courses'); // Redirect to view courses page (we'll create soon)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to add course!', { position: 'top-center' });
    }
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleAddCourse} className="add-course-form">
        <h2 className="add-course-title">➕ Add New Course</h2>

        <input
          type="text"
          placeholder="Course Name"
          required
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="add-course-input"
        />

        <input
          type="text"
          placeholder="Course Code"
          required
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="add-course-input"
        />
        
        <input
          type="text"
          placeholder="Instructor Name"
          required
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          className="add-course-input"
        />

        <textarea
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="add-course-textarea"
          rows="4"
        />

        <input
          type="text"
          placeholder="Image Link (optional)"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          className="add-course-input"
        />

        <button type="submit" className="add-course-button">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
