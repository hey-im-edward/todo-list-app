require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const extensionRoutes = require('./routes/extensions');
app.use('/api/extensions', extensionRoutes);

const pageRoutes = require('./routes/pages');
app.use('/api/pages', pageRoutes);

const PORT = process.env.PORT || 5000;

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Kết nối MongoDB thành công!');
  app.listen(PORT, () => console.log(`Server đang chạy ở cổng ${PORT}`));
})
.catch((err) => {
  console.error('Kết nối MongoDB thất bại:', err);
});