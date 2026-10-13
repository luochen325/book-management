// ============================================
// 业务层 (Service) - 图书业务逻辑
// ============================================
const booksDao = require('../dao/booksDao');

const booksService = {
  /** 分页查询图书列表 */
  async list(keyword, page = 1, pageSize = 5) {
    return await booksDao.list(keyword, page, pageSize);
  },

  /** 按 ID 查询图书 */
  async getById(bookId) {
    return await booksDao.getById(bookId);
  },

  /** 新增图书 */
  async add(book) {
    return await booksDao.insert(book);
  },

  /** 修改图书 */
  async update(bookId, book) {
    return await booksDao.update(bookId, book);
  },

  /** 删除图书 */
  async delete(bookId) {
    return await booksDao.delete(bookId);
  },

  /** 获取全部图书类型 */
  async getAllTypes() {
    return await booksDao.getAllTypes();
  }
};

module.exports = booksService;