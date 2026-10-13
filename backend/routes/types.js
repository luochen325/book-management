// ============================================
// 路由 - 图书类型路由
// ============================================
const express = require('express');
const router = express.Router();
const booksService = require('../services/books');

router.get('/', async (req, res) => {
  try {
    const types = await booksService.getAllTypes();
    res.json({ code: 0, data: types });
  } catch (err) {
    console.error('获取图书类型失败:', err);
    res.json({ code: 1, msg: '获取类型失败' });
  }
});

module.exports = router;