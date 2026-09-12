import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: 'contact',
    },
    email: {
      type: String,
      default: 'hello@skycode.studio',
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '+91 00000 00000',
      trim: true,
    },
    website: {
      type: String,
      default: 'skycode.studio',
      trim: true,
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;