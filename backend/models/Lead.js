import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  plan: {
    type: String,
    required: [true, 'Selected plan is required'],
    trim: true,
    enum: {
      values: ['Basic', 'Premium', 'Ultra Premium'],
      message: '{VALUE} is not a supported plan',
    },
  },
  workType: {
    type: String,
    required: [true, 'Work type is required'],
    trim: true,
    enum: {
      values: ['Website', 'E-Commerce Website', 'Web Page', 'Others'],
      message: '{VALUE} is not a supported work type',
    },
  },
  details: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;