import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Landing Page', 'E-Commerce', 'Custom Web', 'Dashboard', 'Health & Fitness'],
      message: '{VALUE} is not a supported category',
    },
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  liveUrl: {
    type: String,
    required: [true, 'Live URL is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
