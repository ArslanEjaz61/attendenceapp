const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentsWithLowAttendance = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const attendanceThreshold = 75;

    // Aggregate to calculate attendance percentage for each student
    const students = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $lookup: {
          from: 'attendances',
          let: { studentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$subject', subjectId] },
                    { $in: ['$$studentId', '$students.student'] }
                  ]
                }
              }
            }
          ],
          as: 'attendance'
        }
      },
      {
        $project: {
          name: 1,
          studentId: 1,
          attendancePercentage: {
            $multiply: [
              {
                $divide: [
                  {
                    $size: {
                      $filter: {
                        input: '$attendance',
                        as: 'a',
                        cond: {
                          $eq: [
                            { $arrayElemAt: ['$a.students.status', 0] },
                            'present'
                          ]
                        }
                      }
                    }
                  },
                  { $size: '$attendance' }
                ]
              },
              100
            ]
          }
        }
      },
      { $match: { attendancePercentage: { $lt: attendanceThreshold } } }
    ]);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};