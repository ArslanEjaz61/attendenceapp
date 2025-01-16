const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');

exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, studentAttendance } = req.body;
    
    const attendance = new Attendance({
      subject: subjectId,
      date,
      students: studentAttendance,
      markedBy: req.user.id
    });

    await attendance.save();
    await Subject.findByIdAndUpdate(subjectId, { $inc: { totalClasses: 1 } });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceAnalytics = async (req, res) => {
  try {
    const { subjectId, studentId } = req.query;
    
    const attendanceRecords = await Attendance.find({
      subject: subjectId,
      'students.student': studentId
    });

    const totalClasses = await Subject.findById(subjectId).select('totalClasses');
    const presentClasses = attendanceRecords.filter(record => 
      record.students.find(s => 
        s.student.toString() === studentId && s.status === 'present'
      )
    ).length;

    const percentage = (presentClasses / totalClasses.totalClasses) * 100;

    res.json({
      totalClasses: totalClasses.totalClasses,
      presentClasses,
      percentage: Math.round(percentage * 100) / 100,
      isLow: percentage < 75
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};