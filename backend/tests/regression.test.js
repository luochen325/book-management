// ============================================
// 接口回归测试 - 用于 npm test / GitHub Actions
// 使用 mocha + chai + chai-http
// ============================================
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('图书管理系统 接口回归测试', function() {
  this.timeout(10000);

  let createdBookId = null;

  // ---- 图书类型 ----

  it('GET /api/types - 应返回 8 条类型数据', function(done) {
    chai.request(app)
      .get('/api/types')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.at.least(8);
        done();
      });
  });

  // ---- 图书列表 ----

  it('GET /api/books - 默认列表应返回至少 5 条数据', function(done) {
    chai.request(app)
      .get('/api/books')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.data.rows).to.be.an('array');
        expect(res.body.data.rows.length).to.be.at.least(5);
        done();
      });
  });

  it('GET /api/books?keyword=红楼梦 - 模糊搜索', function(done) {
    chai.request(app)
      .get('/api/books?keyword=' + encodeURIComponent('红楼梦'))
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.data.rows).to.be.an('array');
        expect(res.body.data.rows.length).to.be.at.least(1);
        done();
      });
  });

  // ---- 图书详情 ----

  it('GET /api/books/1 - 返回第 1 本图书', function(done) {
    chai.request(app)
      .get('/api/books/1')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.bookId).to.equal(1);
        done();
      });
  });

  it('GET /api/books/99999 - 不存在的 ID 应报错', function(done) {
    chai.request(app)
      .get('/api/books/99999')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(1);
        done();
      });
  });

  // ---- 新增 ----

  it('POST /api/books - 新增一本图书', function(done) {
    chai.request(app)
      .post('/api/books')
      .send({
        bookCde: 'TEST-001',
        bookName: '测试图书' + Date.now(),
        bookType: 1,
        bookAuthor: '测试作者',
        publishPress: '测试出版社',
        publishDate: '2026-01-01',
        borrowed: 0,
        createdBy: 'admin'
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.msg).to.equal('新增成功！');
        // 再从列表末尾取回新增的 ID
        chai.request(app)
          .get('/api/books?pageSize=1&page=1')
          .end(function(err2, res2) {
            if (res2.body.data && res2.body.data.rows.length > 0) {
              createdBookId = res2.body.data.rows[0].bookId;
            }
            done();
          });
      });
  });

  // ---- 修改 ----

  it('PUT /api/books/:id - 修改刚新增的图书', function(done) {
    if (!createdBookId) {
      this.skip();
      return;
    }
    chai.request(app)
      .put('/api/books/' + createdBookId)
      .send({
        bookCde: 'TEST-001-MOD',
        bookName: '修改后测试图书',
        bookType: 2,
        bookAuthor: '修改作者',
        publishPress: '修改出版社',
        publishDate: '2026-06-15',
        borrowed: 1
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.msg).to.equal('修改成功！');
        done();
      });
  });

  // ---- 删除 ----

  it('DELETE /api/books/:id - 删除刚新增的图书', function(done) {
    if (!createdBookId) {
      this.skip();
      return;
    }
    chai.request(app)
      .delete('/api/books/' + createdBookId)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        done();
      });
  });

  // ---- 分页 ----

  it('GET /api/books?page=1&pageSize=2 - 分页返回 2 条', function(done) {
    chai.request(app)
      .get('/api/books?page=1&pageSize=2')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.code).to.equal(0);
        expect(res.body.data.rows.length).to.be.at.most(2);
        expect(res.body.data.total).to.be.at.least(5);
        done();
      });
  });
});