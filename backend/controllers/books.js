// ============================================
// 控制器 (Controller) - 处理请求/响应
// ============================================
const booksService = require('../services/books');

const booksController = {
  /** GET /api/books - 列表 + 搜索 + 分页 */
  async list(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const result = await booksService.list(keyword, page, pageSize);
      res.json({ code: 0, data: result });
    } catch (err) {
      console.error('查询图书列表失败:', err);
      res.json({ code: 1, msg: '查询失败' });
    }
  },

  /** GET /api/books/:id - 详情 */
  async detail(req, res) {
    try {
      const book = await booksService.getById(parseInt(req.params.id));
      if (!book) return res.json({ code: 1, msg: '图书不存在' });
      res.json({ code: 0, data: book });
    } catch (err) {
      console.error('查询图书详情失败:', err);
      res.json({ code: 1, msg: '查询失败' });
    }
  },

  /** POST /api/books - 新增 */
  async add(req, res) {
    try {
      await booksService.add(req.body);
      res.json({ code: 0, msg: '新增成功！' });
    } catch (err) {
      console.error('新增图书失败:', err);
      res.json({ code: 1, msg: '新增失败！' });
    }
  },

  /** PUT /api/books/:id - 修改 */
  async update(req, res) {
    try {
      await booksService.update(parseInt(req.params.id), req.body);
      res.json({ code: 0, msg: '修改成功！' });
    } catch (err) {
      console.error('修改图书失败:', err);
      res.json({ code: 1, msg: '修改失败！' });
    }
  },

  /** DELETE /api/books/:id - 删除 */
  async delete(req, res) {
    try {
      const result = await booksService.delete(parseInt(req.params.id));
      if (result.affectedRows === 0) return res.json({ code: 1, msg: '删除失败：图书不存在' });
      res.json({ code: 0, msg: '删除成功' });
    } catch (err) {
      console.error('删除图书失败:', err);
      res.json({ code: 1, msg: '删除失败' });
    }
  }
};

module.exports = booksController;