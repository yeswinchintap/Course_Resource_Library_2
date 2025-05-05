const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  description: { type: String },
  imageLink: { type: String },
  instructor: { type: String, default:"Purdue Professor" },
  createdAt: { type: Date, default: Date.now },
  contentLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],

  quiz: [{
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true }
  }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
