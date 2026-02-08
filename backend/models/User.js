const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  usernameUpdatedAt: {
    type: Date,
    default: Date.now
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

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 用户名修改中间件
userSchema.pre('save', function(next) {
  if (this.isModified('username')) {
    this.usernameUpdatedAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

// 密码验证方法
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// 检查是否可以修改用户名
userSchema.methods.canUpdateUsername = function() {
  if (!this.usernameUpdatedAt) return true;
  
  const now = new Date();
  const lastUpdate = new Date(this.usernameUpdatedAt);
  const diffInHours = (now - lastUpdate) / (1000 * 60 * 60);
  
  return diffInHours >= 24;
};

// 获取距离下次可以修改用户名的时间
userSchema.methods.getUsernameUpdateRemainingTime = function() {
  if (!this.usernameUpdatedAt) return 0;
  
  const now = new Date();
  const lastUpdate = new Date(this.usernameUpdatedAt);
  const remainingHours = 24 - (now - lastUpdate) / (1000 * 60 * 60);
  
  return Math.max(0, remainingHours);
};

module.exports = mongoose.model('User', userSchema);
