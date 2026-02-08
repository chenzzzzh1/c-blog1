const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { auth } = require('../middleware/auth');

// 获取文章列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const status = req.query.status || 'published';

    const query = { status };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({ message: '获取文章列表失败' });
  }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('category', 'name slug description')
      .populate('tags', 'name slug');

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 增加浏览量
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error('获取文章错误:', error);
    res.status(500).json({ message: '获取文章失败' });
  }
});

// 创建文章
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status, isFeatured } = req.body;

    // 验证必填字段
    if (!title || !content || !category) {
      return res.status(400).json({
        message: '缺少必填字段',
        required: ['title', 'content', 'category'],
        received: {
          title: !!title,
          content: !!content,
          category: !!category
        }
      });
    }

    const article = new Article({
      title,
      content,
      excerpt,
      coverImage,
      author: req.user.userId,
      category,
      tags: tags || [],
      status: status || 'draft',
      isFeatured: isFeatured || false
    });

    await article.save();
    await article.populate('author', 'username avatar');
    await article.populate('category', 'name slug');
    await article.populate('tags', 'name slug');

    res.status(201).json({
      message: '文章创建成功',
      article
    });
  } catch (error) {
    console.error('创建文章错误:', error);
    console.error('错误详情:', error.message);

    // 返回更详细的错误信息
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '数据验证失败',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: '数据格式错误',
        field: error.path,
        value: error.value
      });
    }

    res.status(500).json({
      message: '创建文章失败',
      error: error.message
    });
  }
});

// 更新文章
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权修改此文章' });
    }

    const { title, content, excerpt, coverImage, category, tags, status, isFeatured } = req.body;

    article.title = title || article.title;
    article.content = content || article.content;
    article.excerpt = excerpt || article.excerpt;
    article.coverImage = coverImage || article.coverImage;
    article.category = category || article.category;
    article.tags = tags || article.tags;
    article.status = status !== undefined ? status : article.status;
    article.isFeatured = isFeatured !== undefined ? isFeatured : article.isFeatured;

    await article.save();
    await article.populate('author', 'username avatar');
    await article.populate('category', 'name slug');
    await article.populate('tags', 'name slug');

    res.json({
      message: '文章更新成功',
      article
    });
  } catch (error) {
    console.error('更新文章错误:', error);
    res.status(500).json({ message: '更新文章失败' });
  }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权删除此文章' });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    res.status(500).json({ message: '删除文章失败' });
  }
});

// 点赞文章
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const likeIndex = article.likes.indexOf(req.user.userId);
    if (likeIndex === -1) {
      article.likes.push(req.user.userId);
    } else {
      article.likes.splice(likeIndex, 1);
    }

    await article.save();

    res.json({
      message: likeIndex === -1 ? '点赞成功' : '取消点赞',
      likes: article.likes.length
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '操作失败' });
  }
});

module.exports = router;
