/**
 * 图书管理系统 - 详情页脚本
 * 兼容 jQuery 1.8.3
 */

$(document).ready(function() {
  var bookId = BookApp.getParam('id');
  if (!bookId) {
    alert('参数错误');
    window.location.href = 'index.html';
    return;
  }

  // 构造返回链接，保留列表页查询条件和页码
  var q = BookApp.getParam('q');
  var page = BookApp.getParam('page');
  var backUrl = 'index.html';
  var params = [];
  if (q) params.push('q=' + encodeURIComponent(q));
  if (page) params.push('page=' + page);
  if (params.length > 0) backUrl += '?' + params.join('&');
  $('#backLink').attr('href', backUrl);

  // 加载详情
  BookApp.ajax({
    url: '/api/books/' + bookId,
    success: function(res) {
      if (res.code !== 0) {
        alert('加载失败：' + (res.msg || '图书不存在'));
        return;
      }
      var b = res.data;
      $('#d-bookCde').text(b.bookCde || '-');
      $('#d-bookName').text(b.bookName || '-');
      $('#d-typeName').text(b.typeName || '-');
      $('#d-bookAuthor').text(b.bookAuthor || '-');
      $('#d-publishPress').text(b.publishPress || '-');
      $('#d-borrowed').text(b.borrowed === 1 ? '已借阅' : '未借阅');
      $('#d-createdBy').text(b.createdBy || '-');
      $('#d-creationTime').text(BookApp.formatDate(b.creationTime));
    },
    error: function() {
      alert('网络错误');
    }
  });
});