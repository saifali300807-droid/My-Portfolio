import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Fetch all projects (supports optional ?category= filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Fetch single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, description, liveUrl, imageUrl, tags } = req.body;

    const project = await Project.create({
      title,
      category,
      description,
      liveUrl,
      imageUrl,
      tags,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Project removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;