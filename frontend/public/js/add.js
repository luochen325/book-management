/**
 * 图书管理系统 - 新增页脚本
 * 兼容 jQuery 1.8.3
 */

$(document).ready(function() {
  // 加载图书类型下拉
  loadTypes();

  // 默认入库时间为当天
  var today = new Date();
  var y = today.getFullYear();
  var m = (today.getMonth() + 1);
  var d = today.getDate();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  $('#creationTime').val(y + '-' + m + '-' + d);

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
      borrowed: parseInt($('#borrowed').val()),
      createdBy: $.trim($('#createdBy').val()),
      creationTime: $('#creationTime').val()
    };
    BookApp.ajax({
      url: '/api/books',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(res) {
        alert(res.code === 0 ? '新增成功！' : (res.msg || '新增失败！'));
        window.location.href = 'index.html';
      },
      error: function() {
        alert('新增失败！');
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

  /** 前端必填校验 */
  function validate() {
    if (!$.trim($('#bookCde').val())) { alert('请输入图书编号'); $('#bookCde').focus(); return false; }
    if (!$.trim($('#bookName').val())) { alert('请输入图书名称'); $('#bookName').focus(); return false; }
    if (!$('#bookType').val()) { alert('请选择图书类型'); $('#bookType').focus(); return false; }
    if (!$.trim($('#createdBy').val())) { alert('请输入入库人'); $('#createdBy').focus(); return false; }
    if (!$('#creationTime').val()) { alert('请选择入库时间'); $('#creationTime').focus(); return false; }
    return true;
  }
});