import express from 'express';
import Setting from '../models/Setting.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Fetch public contact details (creates defaults on first call)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'contact' });

    if (!settings) {
      settings = await Setting.create({ key: 'contact' });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update contact details (admin settings page)
// @access  Protected
router.put('/', protect, async (req, res) => {
  try {
    const { email, whatsapp, website, location } = req.body;

    const settings = await Setting.findOneAndUpdate(
      { key: 'contact' },
      { email, whatsapp, website, location },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Contact details updated successfully',
      data: settings,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export default router;