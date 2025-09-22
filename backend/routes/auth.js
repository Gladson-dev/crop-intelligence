import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    console.log('Validation failed - missing fields');
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide all required fields' 
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed - user already exists');
      return res.status(400).json({ 
        success: false,
        error: 'User already exists' 
      });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: err.message
      });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error',
        details: 'A user with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login request received for email:', req.body.email);
  
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('Login failed - missing email or password');
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide both email and password' 
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed - user not found');
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed - invalid password');
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: err.message
      });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error',
        details: 'A user with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
