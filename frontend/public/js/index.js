/**
 * 图书管理系统 - 列表页脚本
 * 兼容 jQuery 1.8.3
 */

$(document).ready(function() {
  var currentPage = 1;
  var keyword = '';

  // 读取 URL 中记忆的查询条件
  var q = BookApp.getParam('q');
  if (q) {
    keyword = q;
    $('#keyword').val(q);
  }
  var p = parseInt(BookApp.getParam('page')) || 1;
  currentPage = p;

  // 加载列表
  loadBooks(currentPage, keyword);

  // 查询按钮
  $('#btnSearch').on('click', function() {
    keyword = $.trim($('#keyword').val());
    currentPage = 1;
    loadBooks(currentPage, keyword);
  });

  // 重置按钮
  $('#btnReset').on('click', function() {
    $('#keyword').val('');
    keyword = '';
    currentPage = 1;
    loadBooks(currentPage, keyword);
  });

  // 回车搜索
  $('#keyword').on('keyup', function(e) {
    if (e.keyCode === 13) {
      $('#btnSearch').trigger('click');
    }
  });

  /** 加载图书列表 */
  function loadBooks(page, kw) {
    BookApp.ajax({
      url: '/api/books',
      data: { keyword: kw || '', page: page, pageSize: 5 },
      success: function(res) {
        if (res.code !== 0) {
          $('#bookTbody').html('<tr class="empty-row"><td colspan="8">加载失败</td></tr>');
          return;
        }
        renderTable(res.data.rows);
        renderRecordSummary(page, res.data.total);
        renderPagination(page, res.data.total, kw);
      },
      error: function() {
        $('#bookTbody').html('<tr class="empty-row"><td colspan="8">网络错误</td></tr>');
      }
    });
  }

  /** 渲染表格 */
  function renderTable(rows) {
    var html = '';
    if (rows.length === 0) {
      html = '<tr class="empty-row"><td colspan="8">暂无数据</td></tr>';
    }
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html += '<tr>';
      html += '<td>' + ((currentPage - 1) * 5 + i + 1) + '</td>';
      html += '<td>' + escapeHtml(r.bookCde) + '</td>';
      html += '<td>' + escapeHtml(r.bookName) + '</td>';
      html += '<td>' + escapeHtml(r.typeName) + '</td>';
      html += '<td>' + escapeHtml(r.bookAuthor) + '</td>';
      html += '<td>' + escapeHtml(r.publishPress) + '</td>';
      html += '<td>' + BookApp.formatDate(r.creationTime) + '</td>';
      html += '<td class="table-actions">';
      html += '<a href="detail.html?id=' + r.bookId + '&q=' + encodeURIComponent(keyword) + '&page=' + currentPage + '">查看</a>';
      html += '<a href="edit.html?id=' + r.bookId + '&q=' + encodeURIComponent(keyword) + '&page=' + currentPage + '">修改</a>';
      html += '<a href="javascript:;" class="del-link" data-id="' + r.bookId + '">删除</a>';
      html += '</td>';
      html += '</tr>';
    }
    $('#bookTbody').html(html);

    // 绑定删除事件
    $('.del-link').on('click', function() {
      var bookId = $(this).data('id');
      if (confirm('确定删除该条图书信息？')) {
        deleteBook(bookId);
      }
    });
  }

  /** 渲染记录总数 */
  function renderRecordSummary(page, total) {
    var start = total === 0 ? 0 : (page - 1) * 5 + 1;
    var end = Math.min(page * 5, total);
    $('#recordSummary').text('共 ' + total + ' 条记录，当前显示第 ' + start + ' - ' + end + ' 条');
  }

  /** 渲染分页 */
  function renderPagination(page, total, kw) {
    var totalPages = Math.ceil(total / 5) || 1;
    var html = '';
    html += '<button ' + (page <= 1 ? 'disabled' : '') + ' data-p="' + (page - 1) + '">上一页</button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="' + (i === page ? 'active' : '') + '" data-p="' + i + '">' + i + '</button>';
    }
    html += '<button ' + (page >= totalPages ? 'disabled' : '') + ' data-p="' + (page + 1) + '">下一页</button>';
    $('#pagination').html(html);

    // 分页点击
    $('#pagination button').on('click', function() {
      var p = parseInt($(this).data('p'));
      if (p && p !== page) {
        currentPage = p;
        loadBooks(p, kw);
        // 滚动到顶部
        $('html, body').animate({ scrollTop: 0 }, 200);
      }
    });
  }

  /** 删除图书 */
  function deleteBook(bookId) {
    BookApp.ajax({
      url: '/api/books/' + bookId,
      type: 'DELETE',
      success: function(res) {
        alert(res.code === 0 ? '删除成功' : (res.msg || '删除失败'));
        loadBooks(currentPage, keyword);
      },
      error: function() {
        alert('删除失败');
      }
    });
  }

  /** HTML 转义 */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});