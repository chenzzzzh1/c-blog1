const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

// 获取文章评论
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId, parent: null })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ message: '获取评论失败' });
  }
});

// 创建评论
router.post('/', auth, async (req, res) => {
  try {
    const { content, article, parent } = req.body;

    const comment = new Comment({
      content,
      article,
      author: req.user.userId,
      parent
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.status(201).json({
      message: '评论发表成功',
      comment
    });
  } catch (error) {
    console.error('发表评论错误:', error);
    res.status(500).json({ message: '发表评论失败' });
  }
});

// 删除评论
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 检查权限
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权删除此评论' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: '删除评论失败' });
  }
});

// 点赞评论
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    const likeIndex = comment.likes.indexOf(req.user.userId);
    if (likeIndex === -1) {
      comment.likes.push(req.user.userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.json({
      message: likeIndex === -1 ? '点赞成功' : '取消点赞',
      likes: comment.likes.length
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '操作失败' });
  }
});

module.exports = router;
