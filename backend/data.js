const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect("mongodb+srv://JHpRv89n2ml6gxns:JHpRv89n2ml6gxns@cluster0.e9lk1.mongodb.net/attendance-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database');
}).catch(err => {
  console.error('Database connection error:', err);
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },  // Removed 'cr' role
  name: { type: String, required: true },
  email: { type: String, required: true },
  studentId: { type: String, sparse: true }, // Only for students
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Define an array of 15 students
const users = [
  { username: "stu1", password: "pass1", role: "student", name: "John Doe1", email: "stu1@example.com", studentId: "S001", department: "Computer Science" },
  { username: "stu2", password: "pass2", role: "student", name: "John Doe2", email: "stu2@example.com", studentId: "S002", department: "Mathematics" },
  { username: "stu3", password: "pass3", role: "student", name: "John Doe3", email: "stu3@example.com", studentId: "S003", department: "Physics" },
  { username: "stu4", password: "pass4", role: "student", name: "John Doe4", email: "stu4@example.com", studentId: "S004", department: "Biology" },
  { username: "stu5", password: "pass5", role: "student", name: "John Doe5", email: "stu5@example.com", studentId: "S005", department: "Chemistry" },
  { username: "stu6", password: "pass6", role: "student", name: "John Doe6", email: "stu6@example.com", studentId: "S006", department: "Computer Science" },
  { username: "stu7", password: "pass7", role: "student", name: "John Doe7", email: "stu7@example.com", studentId: "S007", department: "Mathematics" },
  { username: "stu8", password: "pass8", role: "student", name: "John Doe8", email: "stu8@example.com", studentId: "S008", department: "Physics" },
  { username: "stu9", password: "pass9", role: "student", name: "John Doe9", email: "stu9@example.com", studentId: "S009", department: "Biology" },
  { username: "stu10", password: "pass10", role: "student", name: "John Doe10", email: "stu10@example.com", studentId: "S010", department: "Chemistry" },
  { username: "stu11", password: "pass11", role: "student", name: "John Doe11", email: "stu11@example.com", studentId: "S011", department: "Computer Science" },
  { username: "stu12", password: "pass12", role: "student", name: "John Doe12", email: "stu12@example.com", studentId: "S012", department: "Mathematics" },
  { username: "stu13", password: "pass13", role: "student", name: "John Doe13", email: "stu13@example.com", studentId: "S013", department: "Physics" },
  { username: "stu14", password: "pass14", role: "student", name: "John Doe14", email: "stu14@example.com", studentId: "S014", department: "Biology" },
  { username: "stu15", password: "pass15", role: "student", name: "John Doe15", email: "stu15@example.com", studentId: "S015", department: "Chemistry" }
];

// Function to insert users into the database
const insertUsers = async () => {
  try {
    await User.insertMany(users);
    console.log('Users added successfully');
  } catch (err) {
    console.error('Error adding users:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after saving
  }
};

insertUsers();
