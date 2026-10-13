/**
 * 图书管理系统 - 公共工具函数
 * 兼容 jQuery 1.8.3
 */

var BookApp = window.BookApp || {};

/** 从 URL 中读取查询参数 */
BookApp.getParam = function(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r) return decodeURIComponent(r[2]);
  return '';
};

/** 格式化日期：yyyy-MM-dd */
BookApp.formatDate = function(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  var y = d.getFullYear();
  var m = (d.getMonth() + 1);
  var day = d.getDate();
  if (m < 10) m = '0' + m;
  if (day < 10) day = '0' + day;
  return y + '-' + m + '-' + day;
};

/** AJAX 基础封装 */
BookApp.ajax = function(opt) {
  return $.ajax({
    url: opt.url,
    type: opt.type || 'GET',
    data: opt.data,
    contentType: opt.contentType || 'application/json',
    dataType: 'json',
    success: opt.success,
    error: opt.error || function(xhr, status, err) {
      console.error('AJAX error:', err);
    }
  });
};