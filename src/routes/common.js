import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('shop');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shop: user.shop
      }
    });
  } catch (err) {
    console.error("FetchMe error:", err);
    res.status(500).json({ message: 'Internal Error', error: err.message });
  }
});

export default router;
