const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth');

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ message: '获取分类失败' });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }
    res.json(category);
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ message: '获取分类失败' });
  }
});

// 创建分类
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description
    });

    await category.save();

    res.status(201).json({
      message: '分类创建成功',
      category
    });
  } catch (error) {
    console.error('创建分类错误:', error);
    res.status(500).json({ message: '创建分类失败' });
  }
});

// 更新分类
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    const { name, slug, description } = req.body;

    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description || category.description;

    await category.save();

    res.json({
      message: '分类更新成功',
      category
    });
  } catch (error) {
    console.error('更新分类错误:', error);
    res.status(500).json({ message: '更新分类失败' });
  }
});

// 删除分类
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: '分类删除成功' });
  } catch (error) {
    console.error('删除分类错误:', error);
    res.status(500).json({ message: '删除分类失败' });
  }
});

module.exports = router;
