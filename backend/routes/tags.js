const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { auth, adminAuth } = require('../middleware/auth');

// 获取所有标签
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    console.error('获取标签错误:', error);
    res.status(500).json({ message: '获取标签失败' });
  }
});

// 获取单个标签
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }
    res.json(tag);
  } catch (error) {
    console.error('获取标签错误:', error);
    res.status(500).json({ message: '获取标签失败' });
  }
});

// 创建标签
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const tag = new Tag({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description
    });

    await tag.save();

    res.status(201).json({
      message: '标签创建成功',
      tag
    });
  } catch (error) {
    console.error('创建标签错误:', error);
    res.status(500).json({ message: '创建标签失败' });
  }
});

// 更新标签
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const { name, slug, description } = req.body;

    tag.name = name || tag.name;
    tag.slug = slug || tag.slug;
    tag.description = description || tag.description;

    await tag.save();

    res.json({
      message: '标签更新成功',
      tag
    });
  } catch (error) {
    console.error('更新标签错误:', error);
    res.status(500).json({ message: '更新标签失败' });
  }
});

// 删除标签
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);

    res.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('删除标签错误:', error);
    res.status(500).json({ message: '删除标签失败' });
  }
});

module.exports = router;
