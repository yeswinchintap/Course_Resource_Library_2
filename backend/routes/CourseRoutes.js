const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const CourseController = require('../controllers/CourseController');

// Apply authentication middleware to all course routes
router.use(auth);

// ✅ Place static routes first
router.get('/admin/stats', checkRole('admin'), CourseController.getCourseStats);

// ➡️ Admin-only route to create a course
router.post('/', checkRole('admin'), CourseController.createCourse);

// ➡️ Any authenticated user (admin/student/instructor) can view courses
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// ➡️ Admin-only routes for modifying/deleting courses
router.put('/:id', checkRole('admin'), CourseController.updateCourse);
router.delete('/:id', checkRole('admin'), CourseController.deleteCourse);

// ➡️ Students and admins can view enrolled students or grades
router.get('/:id/students', CourseController.getStudentsByCourse);
router.get('/:courseId/average', CourseController.calculateAverageGrade);

// ➡️ Only admins can add students to a course manually
router.put('/:courseId/add-students', CourseController.addStudentsToCourse);

router.get('/student/enrolled', CourseController.getEnrolledCoursesForStudent);

router.get('/:id/students', checkRole('admin'), CourseController.getStudentsByCourse);

router.delete('/:id', checkRole('admin'), CourseController.deleteCourse);

router.post('/:id/add-content', checkRole('admin'), CourseController.addContentLinks);

router.post('/:id/add-quiz', checkRole('admin'), CourseController.addQuiz);

router.post('/:courseId/send-success', auth, CourseController.sendSuccessEmail);


module.exports = router;
