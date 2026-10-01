import express from 'express';
import { generateToken, requireAuth } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configured admin credentials
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@videosensor.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Validate credentials
  if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const user = {
      id: 'usr-admin-1',
      name: 'Platform Administrator',
      email: ADMIN_EMAIL,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    };

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user,
    });
  }

  return res.status(401).json({
    error: 'Invalid email or password. Please check your credentials.',
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default router;
