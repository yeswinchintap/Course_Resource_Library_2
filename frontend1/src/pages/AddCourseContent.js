import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddCourse.css';

const AddCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [contentLinks, setContentLinks] = useState([
    { title: '', url: '' }
  ]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseName(res.data.courseName);
      } catch (error) {
        toast.error("Failed to load course.");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleAddField = () => {
    setContentLinks([...contentLinks, { title: '', url: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...contentLinks];
    updated[index][field] = value;
    setContentLinks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/add-content`, 
        { contentLinks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Content links added successfully!');
      navigate('/admin/view-courses');
    } catch (err) {
        console.error("❌ Error adding content:", err);
        toast.error(err.response?.data?.message || "Failed to add content");
      }
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleSubmit} className="add-course-form">
        <h2 className="add-course-title">🎬 Add Content for: {courseName}</h2>

        {contentLinks.map((link, index) => (
          <div key={index} className="content-link-group">
            <input
              type="text"
              placeholder="Video Title"
              value={link.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              className="add-course-input"
              required
            />
            <input
              type="url"
              placeholder="Video URL"
              value={link.url}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
              className="add-course-input"
              required
            />
          </div>
        ))}

        <button type="button" onClick={handleAddField} className="add-course-button" style={{ marginBottom: '10px' }}>
          ➕ Add Another Link
        </button>

        <button type="submit" className="add-course-button">✅ Submit Content</button>
      </form>
    </div>
  );
};

export default AddCourseContent;
