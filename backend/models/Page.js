const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: '📄' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
  order: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false }
});

module.exports = mongoose.model('Page', pageSchema);
