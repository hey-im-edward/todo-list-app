const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Extension = require('../models/Extension');

// Lấy danh sách extension đã duyệt cho user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const extensions = await Extension.find({ status: 'approved' });
    res.json(extensions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách extension' });
  }
});

module.exports = router;
