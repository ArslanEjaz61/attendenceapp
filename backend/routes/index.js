const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const subjectController = require('../controllers/subjectController');
const attendanceController = require('../controllers/attendanceController');

// Auth routes
router.post('/auth/login', authController.login);

// User routes
router.post('/users', auth(['teacher']), userController.createUser);
router.get('/students/low-attendance', auth(['teacher']), userController.getStudentsWithLowAttendance);

// Subject routes
router.post('/subjects', auth(['teacher']), subjectController.createSubject);
router.get('/subjects', auth(['teacher', 'student', 'cr']), subjectController.getSubjects);

// Attendance routes
router.post('/attendance', auth(['teacher', 'cr']), attendanceController.markAttendance);
router.get('/attendance/analytics', auth(['teacher', 'student']), attendanceController.getAttendanceAnalytics);

// GET /students
router.get('/students',auth(['teacher']), async (req, res) => {
    try {
      const students = await Student.find({});
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  });
  
module.exports = router;