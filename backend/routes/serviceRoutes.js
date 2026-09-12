import express from 'express';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/services
// @desc    Fetch all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/services/:id
// @desc    Fetch single service
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, features, icon } = req.body;

    const service = await Service.create({
      title,
      description,
      features,
      icon,
    });

    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update an existing service
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;