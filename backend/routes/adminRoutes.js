import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/admin/login
// @desc    Authenticate admin & retrieve JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password.',
      });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/me
// @desc    Verify active session
// @access  Protected
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

// @route   PUT /api/admin/credentials
// @desc    Update admin username / password (current password required)
// @access  Protected
router.put('/credentials', protect, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation ke liye current password zaroori hai.',
      });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const isValid = await admin.comparePassword(currentPassword);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password galat hai.',
      });
    }

    if (newUsername && newUsername.trim().toLowerCase() !== admin.username) {
      const username = newUsername.trim().toLowerCase();

      if (username.length < 4) {
        return res.status(400).json({
          success: false,
          message: 'Username kam se kam 4 characters ka hona chahiye.',
        });
      }

      const existing = await Admin.findOne({ username });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ye username already taken hai.',
        });
      }

      admin.username = username;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password kam se kam 6 characters ka hona chahiye.',
        });
      }

      // pre-save hook ise hash kar dega
      admin.password = newPassword;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Login credentials update ho gaye — agli baar inhi se login hoga.',
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
