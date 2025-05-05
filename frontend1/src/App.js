import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import AddCourse from './pages/AddCourse'; 
import AddBook from './pages/AddBook';
import ViewCourses from './pages/ViewCourses';
import ViewBooks from './pages/ViewBooks';
import SearchBooks from './pages/SearchBooks';
import AdminStats from './pages/AdminStats';
import StudentBooks from './pages/StudentBooks';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import CourseConfirmation from './pages/CourseConfirmation';
import StudentEnrolledCourses from './pages/StudentEnrolledCourses';
import AdminCourseStudents from './pages/AdminCourseStudents';
import EditCourse from './pages/EditCourse';
import AddCourseContent from './pages/AddCourseContent';
import StudentCourseContent from './pages/StudentCourseContent';
import AddCourseQuiz from './pages/AddCourseQuiz';
import StudentCourseQuiz from './pages/StudentCourseQuiz';


function App() {
  return (
    <>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/add-book" element={<AddBook />} />
          <Route path="/admin/view-courses" element={<ViewCourses />} />
          <Route path="/admin/view-books" element={<ViewBooks />} />
          <Route path="/search-books" element={<SearchBooks />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/student/books" element={<StudentBooks />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/course-confirmation" element={<CourseConfirmation />} />
          <Route path="/student/enrolled" element={<StudentEnrolledCourses />} />
          <Route path="/admin/course/:courseId/students" element={<AdminCourseStudents />} />
          <Route path="/admin/edit-course/:courseId" element={<EditCourse />} />
          <Route path="/admin/course/:courseId/add-content" element={<AddCourseContent />} />
          <Route path="/student/course/:courseId/content" element={<StudentCourseContent />} />
          <Route path="/admin/course/:courseId/add-quiz" element={<AddCourseQuiz />} />
          <Route path="/student/course/:courseId/quiz" element={<StudentCourseQuiz />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}


export default App;
