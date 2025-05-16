const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header

  if (!token) return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
}

// Tạo task mới
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({
      user: req.user.userId, // Lấy userId từ token đã giải mã
      title,
      completed: false
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy tất cả task của user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật task (đánh dấu hoàn thành hoặc sửa title)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json({ message: 'Đã xóa task' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;