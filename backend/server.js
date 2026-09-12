import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

// Configuration
dotenv.config();
const app = express();

// Database Connection
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    agency: 'Sky Code',
    status: 'Online',
    version: '1.0.0',
    documentation: '/api/projects, /api/services, /api/admin',
  });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on Sky Code Server`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Sky Code Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Sky Code Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
