const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// Lấy tất cả page, sắp xếp theo order
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find().sort({ order: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo page mới
router.post('/', async (req, res) => {
  try {
    const { title, icon, parent, isFavorite } = req.body;
    const page = new Page({ title, icon, parent: parent || null, isFavorite });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo page' });
  }
});

// Sửa page
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const page = await Page.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật thất bại' });
  }
});

// Xóa page
router.delete('/:id', async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa page' });
  } catch (err) {
    res.status(500).json({ error: 'Xóa thất bại' });
  }
});

module.exports = router;
