import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StudentCourseQuiz.css';

const StudentCourseQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuiz(res.data.quiz || []);
    } catch (error) {
      toast.error("Failed to load quiz");
    }
  };

  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);

    const passed = correct >= Math.ceil(quiz.length * 0.6);
    if (passed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:5000/api/courses/${courseId}/send-success`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("🎉 Success email sent!");
      } catch (error) {
        toast.error("Failed to send success email");
      }
    }
  };

  return (
    <div className="quiz-container">
      <h2>📝 Course Quiz</h2>
      {!quiz.length ? (
        <p>No quiz available.</p>
      ) : (
        <form onSubmit={handleSubmit} className="quiz-form">
          {quiz.map((q, index) => (
            <div key={index} className="quiz-question">
              <p><strong>Q{index + 1}:</strong> {q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="quiz-option">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={() => handleOptionChange(index, opt)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!submitted && (
            <button type="submit" className="submit-quiz">✅ Submit Quiz</button>
          )}
        </form>
      )}

      {submitted && (
        <div className="quiz-result">
          <h3>Your Score: {score} / {quiz.length}</h3>
          {score >= Math.ceil(quiz.length * 0.6) ? (
            <p className="pass">🎉 Passed! A success email has been sent to you.</p>
          ) : (
            <p className="fail">❌ You did not pass. Try again later!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourseQuiz;
