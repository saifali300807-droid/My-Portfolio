import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const username = process.env.DEFAULT_ADMIN_USERNAME || 'skycode_admin';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'SkyCodeLuxury2025!';

    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });

    if (existingAdmin) {
      console.log(`[Seed Info]: Admin '${username}' already exists. Skipping.`);
      process.exit(0);
    }

    await Admin.create({ username, password });

    console.log(`--------------------------------------------------`);
    console.log(`[Seed Success]: Default admin created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`--------------------------------------------------`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();