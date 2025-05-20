const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền admin
const requireAdmin = async (req, res, next) => {
  try {    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới được truy cập' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xác thực quyền admin' });
  }
};

module.exports = { authenticateToken, requireAdmin };
