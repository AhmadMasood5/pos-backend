import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).populate('shop');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};
