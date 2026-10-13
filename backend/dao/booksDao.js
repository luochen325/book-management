// ============================================
// 数据访问层 (DAO) - 封装对 book_info / book_type 的 SQL 操作
// ============================================
const pool = require('../config/db');

const booksDao = {
  /**
   * 查询图书列表（分页 + 可选模糊搜索）
   * @param {string} [keyword] 模糊查询关键字
   * @param {number} page 页码
   * @param {number} pageSize 每页条数
   * @returns  { rows, total }
   */
  async list(keyword, page, pageSize) {
    const offset = (page - 1) * pageSize;
    let where = '';
    const params = [];
    if (keyword) {
      where = 'WHERE b.bookName LIKE ?';
      params.push(`%${keyword}%`);
    }
    const sqlCount = `SELECT COUNT(*) AS total FROM book_info b ${where}`;
    const sqlData = `
      SELECT b.*, t.typeName
      FROM book_info b
      LEFT JOIN book_type t ON b.bookType = t.id
      ${where}
      ORDER BY b.creationTime DESC
      LIMIT ? OFFSET ?`;
    const [[{ total }]] = await pool.query(sqlCount, params);
    const [rows] = await pool.query(sqlData, [...params, pageSize, offset]);
    return { rows, total };
  },

  /** 按 ID 查询单本图书 */
  async getById(bookId) {
    const sql = `
      SELECT b.*, t.typeName
      FROM book_info b
      LEFT JOIN book_type t ON b.bookType = t.id
      WHERE b.bookId = ?`;
    const [[row]] = await pool.query(sql, [bookId]);
    return row;
  },

  /** 新增图书 */
  async insert(book) {
    const sql = `
      INSERT INTO book_info (bookCde, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [
      book.bookCde, book.bookName, book.bookType,
      book.bookAuthor || '', book.publishPress || '',
      book.publishDate || null, book.borrowed || 0,
      book.createdBy || 'admin'
    ]);
    return result;
  },

  /** 修改图书 */
  async update(bookId, book) {
    const sql = `
      UPDATE book_info
      SET bookCde=?, bookName=?, bookType=?, bookAuthor=?, publishPress=?, publishDate=?, borrowed=?
      WHERE bookId=?`;
    const [result] = await pool.query(sql, [
      book.bookCde, book.bookName, book.bookType,
      book.bookAuthor || '', book.publishPress || '',
      book.publishDate || null, book.borrowed || 0,
      bookId
    ]);
    return result;
  },

  /** 删除图书 */
  async delete(bookId) {
    const [result] = await pool.query('DELETE FROM book_info WHERE bookId = ?', [bookId]);
    return result;
  },

  /** 读取所有图书类型 */
  async getAllTypes() {
    const [rows] = await pool.query('SELECT id, typeName FROM book_type ORDER BY id');
    return rows;
  }
};

module.exports = booksDao;