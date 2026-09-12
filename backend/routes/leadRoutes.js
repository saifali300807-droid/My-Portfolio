import express from 'express';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/leads
// @desc    Visitor submits a plan request (name, whatsapp, email, plan, work type)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, whatsapp, email, plan, workType, details } = req.body;

    const lead = await Lead.create({
      name,
      whatsapp,
      email,
      plan,
      workType,
      details,
    });

    return res.status(201).json({
      success: true,
      message: 'Request received! We will contact you soon.',
      data: lead,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/leads
// @desc    Fetch all plan submissions (admin panel)
// @access  Protected
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead status (new / contacted / closed)
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead submission
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;