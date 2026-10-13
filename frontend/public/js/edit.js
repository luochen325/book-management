/**
 * 图书管理系统 - 修改页脚本
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
  $('#backLink, #btnBack').attr('data-back', backUrl);

  // 返回按钮
  $('#backLink, #btnBack').on('click', function(e) {
    e.preventDefault();
    window.location.href = $(this).attr('data-back') || 'index.html';
  });

  // 加载图书类型下拉
  loadTypes();

  // 加载图书信息回填
  loadBook(bookId);

  // 保存按钮
  $('#btnSave').on('click', function() {
    if (!validate()) return;
    var data = {
      bookCde: $.trim($('#bookCde').val()),
      bookName: $.trim($('#bookName').val()),
      bookType: parseInt($('#bookType').val()),
      bookAuthor: $.trim($('#bookAuthor').val()),
      publishPress: $.trim($('#publishPress').val()),
      publishDate: $('#publishDate').val() || null,
      borrowed: parseInt($('#borrowed').val())
    };
    BookApp.ajax({
      url: '/api/books/' + bookId,
      type: 'PUT',
      data: JSON.stringify(data),
      success: function(res) {
        alert(res.code === 0 ? '修改成功！' : (res.msg || '修改失败！'));
        window.location.href = backUrl;
      },
      error: function() {
        alert('修改失败！');
      }
    });
  });

  /** 加载图书类型 */
  function loadTypes() {
    BookApp.ajax({
      url: '/api/types',
      success: function(res) {
        if (res.code !== 0) return;
        var html = '<option value="">请选择</option>';
        for (var i = 0; i < res.data.length; i++) {
          html += '<option value="' + res.data[i].id + '">' + res.data[i].typeName + '</option>';
        }
        $('#bookType').html(html);
      }
    });
  }

  /** 加载图书数据回填 */
  function loadBook(id) {
    BookApp.ajax({
      url: '/api/books/' + id,
      success: function(res) {
        if (res.code !== 0) {
          alert('加载失败：' + (res.msg || '图书不存在'));
          window.location.href = backUrl;
          return;
        }
        var b = res.data;
        $('#bookCde').val(b.bookCde || '');
        $('#bookName').val(b.bookName || '');
        $('#bookType').val(b.bookType || '');
        $('#bookAuthor').val(b.bookAuthor || '');
        $('#publishPress').val(b.publishPress || '');
        if (b.publishDate) {
          $('#publishDate').val(BookApp.formatDate(b.publishDate));
        }
        $('#borrowed').val(b.borrowed || 0);
        $('#createdBy').val(b.createdBy || '');
        $('#creationTime').val(BookApp.formatDate(b.creationTime));
      },
      error: function() {
        alert('网络错误');
      }
    });
  }

  /** 前端必填校验 */
  function validate() {
    if (!$.trim($('#bookCde').val())) { alert('请输入图书编号'); $('#bookCde').focus(); return false; }
    if (!$.trim($('#bookName').val())) { alert('请输入图书名称'); $('#bookName').focus(); return false; }
    if (!$('#bookType').val()) { alert('请选择图书类型'); $('#bookType').focus(); return false; }
    return true;
  }
});