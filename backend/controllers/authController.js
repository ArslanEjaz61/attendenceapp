const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ username });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the plain-text password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Respond with the user details (without token)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name
      },
      role: user.role
    });
  } catch (error) {
    console.error(error); // For debugging purposes
    res.status(500).json({ message: 'Server error' });
  }
};
