// backend/scripts/seedProjects.js
/* ---------------------------------------------------------------------------
 * Sky Code — Seed Existing Works
 * ---------------------------------------------------------------------------
 * Upserts the studio's existing portfolio projects into the database so they
 * show on the site AND become editable from the Admin Panel.
 * Run:  npm run seed:works
 * ------------------------------------------------------------------------- */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project.js';

dotenv.config();

const EXISTING_WORKS = [
  {
    title: 'Girls Wear - Modern E-Commerce Platform',
    category: 'E-Commerce',
    description:
      'A modern fashion e-commerce platform with product grid, search filters, and shopping cart UI.',
    tags: ['MERN Stack', 'Redux', 'Tailwind CSS', 'Render Cloud'],
    imageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85',
    liveUrl: 'https://super-collection-frontend.onrender.com',
    createdAt: new Date('2025-06-01T00:00:00Z'),
  },
  {
    title: 'TechVault - SaaS Analytics Dashboard',
    category: 'Dashboard',
    description:
      'A modern analytics dashboard with real-time data visualization, user management, and reporting features built for SaaS platforms.',
    tags: ['React', 'Node.js', 'Chart.js', 'MongoDB'],
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
    liveUrl: 'https://techvault-demo.vercel.app',
    createdAt: new Date('2025-05-01T00:00:00Z'),
  },
  {
    title: 'Foodie Express - Food Delivery App',
    category: 'E-Commerce',
    description:
      'A food delivery platform with restaurant listings, cart management, and order tracking with real-time updates.',
    tags: ['MERN Stack', 'Redux', 'Stripe', 'Socket.io'],
    imageUrl:
      'https://images.unsplash.com/photo-1567620905732-2d01ec7ab71c?auto=format&fit=crop&w=1600&q=85',
    liveUrl: 'https://foodie-express-demo.netlify.app',
    createdAt: new Date('2025-04-01T00:00:00Z'),
  },
  {
    title: 'FitTrack Pro - Fitness Tracker',
    category: 'Health & Fitness',
    description:
      'A fitness tracking application with workout plans, progress charts, and social features for health enthusiasts.',
    tags: ['React Native', 'Firebase', 'Expo', 'Charts'],
    imageUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=85',
    liveUrl: 'https://fittrack-pro-demo.onrender.com',
    createdAt: new Date('2025-03-01T00:00:00Z'),
  },
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    for (const work of EXISTING_WORKS) {
      const result = await Project.findOneAndUpdate(
        { title: work.title },
        { $set: work },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      console.log(`[Seed] ${result ? 'Synced' : 'Created'}: ${work.title}`);
    }

    const count = await Project.countDocuments();
    console.log(`[Seed Success] Total projects in DB: ${count}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProjects();