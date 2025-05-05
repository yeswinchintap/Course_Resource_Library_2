const Course = require('../models/Course');
const { sendCourseConfirmationEmail, sendQuizSuccessEmail  } = require('../utils/sendEmail'); 
const User = require('../models/User');

const CourseController = {
  createCourse: async (req, res) => {
    try {
      const { courseName, courseCode, description, imageLink } = req.body;

      const existingCourse = await Course.findOne({ courseCode });
      if (existingCourse) {
        return res.status(409).json({ message: "Course code already exists" });
      }

      const newCourse = new Course({ courseName, courseCode, description, imageLink });
      await newCourse.save();

      res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
      res.status(500).json({ message: "Error creating course", error: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const { courseName, courseCode, description, imageLink, instructor } = req.body;
  
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { courseName, courseCode, description, imageLink, instructor }, // ✅ include instructor
        { new: true, runValidators: true }
      );
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
  },
  
  deleteCourse: async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting course", error: error.message });
    }
  },

  getStudentsByCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate('students');
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course.students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error: error.message });
    }
  },

  addContentLinks: async (req, res) => {
    try {
      const { contentLinks } = req.body;
      const course = await Course.findById(req.params.id);
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Ensure contentLinks is a valid array
      if (!Array.isArray(contentLinks) || contentLinks.length === 0) {
        return res.status(400).json({ message: "Content links required" });
      }
  
      course.contentLinks = [...course.contentLinks, ...contentLinks];
      await course.save();
  
      res.status(200).json({ message: "Content links added", course });
    } catch (error) {
      res.status(500).json({ message: "Failed to add content links", error: error.message });
    }
  },  

  addQuiz: async (req, res) => {
    try {
      const { quiz } = req.body;
  
      if (!Array.isArray(quiz) || quiz.length === 0) {
        return res.status(400).json({ message: "Quiz must be a non-empty array" });
      }
  
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      course.quiz = quiz;
      await course.save();
  
      res.status(200).json({ message: "Quiz added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to add quiz", error: err.message });
    }
  },
  
  sendSuccessEmail: async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      await sendQuizSuccessEmail(
        user.email,
        user.username,
        course.courseName,
        `Passed quiz - Congratulations! 🎉`
      );
  
      res.status(200).json({ message: "Success email sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send success email", error: error.message });
    }
  },
  
  
  
  calculateAverageGrade: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const grades = await Grade.find({ courseId });
  
      if (grades.length === 0) {
        return res.json({ averageGrade: 0 });
      }
  
      const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
      const averageGrade = totalScore / grades.length;
  
      res.status(200).json({ averageGrade });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating average grade', error: error.message });
    }
  },
  
  addStudentsToCourse: async (req, res) => {
    try {
      console.log("🚨 Incoming Request Body:", req.body);
      console.log("🚨 Extracted studentId:", req.body.studentId);

      const { studentId } = req.body;
      const { courseId } = req.params;

      if (!studentId) {
        return res.status(400).json({ message: "Missing studentId in request body" });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (course.students.includes(studentId)) {
        return res.status(400).json({ message: "You are already registered for this course." });
      }

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({ message: "Student not found or not a valid student role" });
      }

      course.students.push(studentId);
      await course.save();

      const registrationId = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await sendCourseConfirmationEmail(
        student.email,
        student.username,
        course.courseName,
        registrationId
      );

      res.status(200).json({
        message: "Student registered successfully!",
        registrationId
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to register student", error: error.message });
    }
  },

  getEnrolledCoursesForStudent: async (req, res) => {
    try {
      const studentId = req.user._id; // ⬅️ user ID from token
  
      const courses = await Course.find({ students: studentId });
  
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch enrolled courses', error: error.message });
    }
  },  

  getCourseStats: async (req, res) => {
    try {
      const totalCourses = await Course.countDocuments();
      const courses = await Course.find().populate('students');
  
      const completedPerCourse = courses.map(course => {
        const registered = Array.isArray(course.students) ? course.students.length : 0;
      
        return {
          courseName: course.courseName || "Untitled",
          registered,
          completed: Math.floor(registered * 0.6)
        };
      });
      
      res.status(200).json({
        totalCourses,
        totalRegistrations: completedPerCourse.reduce((sum, c) => sum + c.registered, 0),
        completedPerCourse
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching course stats', error: error.message });
    }
  },
  

  getStudentsByCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate('students', 'username email role');
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json(course.students);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch students', error: error.message });
    }
  }
  
  

};



module.exports = CourseController;
