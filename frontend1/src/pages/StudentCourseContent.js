import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './StudentCourseContent.css';

const StudentCourseContent = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    fetchCourse();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
      const savedProgress = JSON.parse(localStorage.getItem(`progress-${courseId}`)) || {};
      setCompleted(savedProgress);
    } catch (error) {
      console.error("Failed to load course", error);
    }
  };

  const handleToggle = (index) => {
    const updated = { ...completed, [index]: !completed[index] };
    setCompleted(updated);
    localStorage.setItem(`progress-${courseId}`, JSON.stringify(updated));
  };

  const total = course?.contentLinks?.length || 0;
  const done = Object.values(completed).filter(Boolean).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="student-content-container">
      <h2>📘 {course?.courseName}</h2>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          {progress}% Completed
        </div>
      </div>

      <ul className="content-list">
        {course?.contentLinks?.map((link, index) => (
          <li key={index} className="content-item">
            <input
              type="checkbox"
              checked={completed[index] || false}
              onChange={() => handleToggle(index)}
            />
            <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
          </li>
        ))}
      </ul>

      {progress === 100 && (
        <Link to={`/student/course/${courseId}/quiz`}>
          <button className="start-quiz-button">🎯 Take Quiz</button>
        </Link>
      )}
    </div>
  );
};

export default StudentCourseContent;
