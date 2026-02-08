const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// 获取用户信息
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const { username, bio, avatar } = req.body;
    const currentUser = await User.findById(req.user.userId);

    // 检查权限
    if (user._id.toString() !== req.user.userId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: '无权修改此用户信息' });
    }

    // 检查是否要修改用户名
    if (username && username !== user.username) {
      // 管理员可以随意修改,普通用户需要检查限制
      if (currentUser.role !== 'admin') {
        // 检查是否可以修改用户名
        if (!user.canUpdateUsername()) {
          const remainingHours = Math.ceil(user.getUsernameUpdateRemainingTime());
          return res.status(400).json({
            message: `用户名修改过于频繁,请${remainingHours}小时后再试`,
            canUpdateUsername: false,
            remainingHours
          });
        }
      }

      // 检查用户名是否已被使用
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: '该用户名已被使用' });
      }

      user.username = username;
    }

    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;

    await user.save();

    // 返回用户信息,不包含密码
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: '用户信息更新成功',
      user: userResponse
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '更新用户信息失败' });
  }
});

module.exports = router;
