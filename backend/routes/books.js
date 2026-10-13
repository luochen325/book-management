// ============================================
// 路由 - 图书相关路由
// ============================================
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

router.get('/',    booksController.list);
router.get('/:id', booksController.detail);
router.post('/',   booksController.add);
router.put('/:id', booksController.update);
router.delete('/:id', booksController.delete);

module.exports = router;