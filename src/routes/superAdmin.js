import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

const router = express.Router();

router.get('/admins', auth, requireRole(['SUPER_ADMIN']), async (req, res) => {
  const admins = await User.find({ role: 'SHOP_ADMIN' }).populate('shop');
  res.json({ admins });
});

router.post('/admins/:id/approve', auth, requireRole(['SUPER_ADMIN']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'SHOP_ADMIN') return res.status(404).json({ message: 'Admin Not found' });

  user.status = 'ACTIVE';
  await user.save();
  await Shop.findByIdAndUpdate(user.shop, { isActive: true });

  res.json({ message: 'User approved successfully' });
});

router.post('/admins/:id/disable', auth, requireRole(['SUPER_ADMIN']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'SHOP_ADMIN') return res.status(404).json({ message: 'Admin Not found' });

  user.status = 'INACTIVE';
  await user.save();
  await Shop.findByIdAndUpdate(user.shop, { isActive: false });

  res.json({ message: 'User disabled successfully' });
});

router.delete('/admin/:id', auth, requireRole(['SUPER_ADMIN']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'SHOP_ADMIN') return res.status(404).json({ message: 'Admin Not Found' });

  const shopId = user.shop;
  await User.findByIdAndDelete(user._id);
  await Shop.findByIdAndDelete(shopId);

  res.json({ message: 'User Deleted Successfully' });
});

router.post('/create-super', async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const bcrypt = (await import('bcryptjs')).default;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash, role: 'SUPER_ADMIN', status: 'ACTIVE' });
  res.json({ message: 'Super Admin Created Successfully', id: user._id });
});

export default router;
