const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'cr'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  studentId: { type: String, sparse: true }, // Only for students
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
