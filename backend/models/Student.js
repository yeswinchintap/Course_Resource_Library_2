const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email:     { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
