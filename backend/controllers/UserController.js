const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = {
  signup: async (req, res) => {
    try {
      const { username, email, password, role, adminKey } = req.body;

      // 🔐 Restrict admin role to valid adminKey only
      if (role === 'admin') {
        if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
          return res.status(403).send('Unauthorized admin registration');
        }
      }

      const existing = await User.findOne({ email });
      if (existing) return res.status(409).send('Email already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role });

      await newUser.save();

      const token = jwt.sign(
        { _id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        message: 'Signup successful',
        token,
        username: newUser.username,
        role: newUser.role,
        userId: newUser._id
      });
    } catch (err) {
      res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).send('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send('Incorrect password');

      const token = jwt.sign(
        { _id: user._id, role: user.role , email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login successful',
        token,
        username: user.username,
        role: user.role,
        userId: user._id 
      });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }
};

module.exports = UserController;
