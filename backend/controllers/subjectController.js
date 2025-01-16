const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('teacher', 'name')
      .populate('students', 'name studentId');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};