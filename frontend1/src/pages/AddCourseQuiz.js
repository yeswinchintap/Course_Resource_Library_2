import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddCourse.css';

const AddCourseQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [quiz, setQuiz] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseName(res.data.courseName);
      } catch (err) {
        toast.error("Failed to load course.");
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz];
    updated[index][field] = value;
    setQuiz(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quiz];
    updated[qIndex].options[optIndex] = value;
    setQuiz(updated);
  };

  const addQuestion = () => {
    setQuiz([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log("📤 Submitting quiz:", quiz);
      await axios.post(`http://localhost:5000/api/courses/${courseId}/add-quiz`, { quiz }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Quiz added successfully!");
      navigate('/admin/view-courses');
    } catch (err) {
      console.error(err);
      toast.error("Failed to add quiz");
    }
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleSubmit} className="add-course-form">
        <h2 className="add-course-title">📝 Add Quiz for: {courseName}</h2>

        {quiz.map((q, qIndex) => (
          <div key={qIndex} className="quiz-question-block">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
              className="add-course-input"
              required
            />

            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                className="add-course-input"
                required
              />
            ))}

            <select
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
              className="add-course-input"
              required
            >
              <option value="">Select Correct Answer</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="add-course-button">➕ Add Question</button>
        <button type="submit" className="add-course-button">✅ Submit Quiz</button>
      </form>
    </div>
  );
};

export default AddCourseQuiz;
