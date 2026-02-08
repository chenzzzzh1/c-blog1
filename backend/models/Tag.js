const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 30
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 虚拟字段:文章数量
tagSchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'tags',
  count: true
});

// 确保虚拟字段在JSON中包含
tagSchema.set('toJSON', { virtuals: true });
tagSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tag', tagSchema);
