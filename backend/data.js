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

// Create the model
const User = mongoose.model('User', userSchema);

// Insert multiple users without bcrypt (plain text password)
const users = [
  {
    username: 'tech',
    password: '1234',  // Plain text password
    role: 'teacher',
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    department: 'Mathematics'
  }
];

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
