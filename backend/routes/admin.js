const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Post = require('../models/Post');
const Extension = require('../models/Extension');

// Ví dụ: route chỉ dành cho admin
router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Chào mừng admin!', user: req.user });
});

// Tạo bài viết mới
router.post('/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.userId
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo bài viết' });
  }
});

// Lấy danh sách bài viết
router.get('/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài viết' });
  }
});

// Sửa bài viết
router.put('/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bài viết' });
  }
});

// Xóa bài viết
router.delete('/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.json({ message: 'Đã xóa bài viết' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa bài viết' });
  }
});

// Tạo extension mới
router.post('/extensions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const extension = new Extension({
      name,
      description,
      author: req.user.userId
    });
    await extension.save();
    res.status(201).json(extension);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo extension' });
  }
});

// Lấy danh sách extension
router.get('/extensions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const extensions = await Extension.find().populate('author', 'username');
    res.json(extensions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách extension' });
  }
});

// Sửa extension
router.put('/extensions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const extension = await Extension.findByIdAndUpdate(
      req.params.id,
      { name, description, status, updatedAt: Date.now() },
      { new: true }
    );
    if (!extension) return res.status(404).json({ message: 'Không tìm thấy extension' });
    res.json(extension);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật extension' });
  }
});

// Xóa extension
router.delete('/extensions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const extension = await Extension.findByIdAndDelete(req.params.id);
    if (!extension) return res.status(404).json({ message: 'Không tìm thấy extension' });
    res.json({ message: 'Đã xóa extension' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa extension' });
  }
});

module.exports = router;
