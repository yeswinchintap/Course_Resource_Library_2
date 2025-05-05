const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  score:     { type: Number, required: true }
});

module.exports = mongoose.model('Grade', gradeSchema);
