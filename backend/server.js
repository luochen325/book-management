// ============================================
// 入口 - Express 服务器
// ============================================
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态页面托管（前端）
const publicDir = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(publicDir));

// API 路由
app.use('/api/books', require('./routes/books'));
app.use('/api/types', require('./routes/types'));

// SPA 兜底：所有非 API 非静态资源的请求回退到 index.html
// (本项目中每个页面是独立 html，不需要 SPA 兜底，仅做静态托管即可)


// 健康检查接口（用于 Actions 探活 / 运维监控）
app.get('/api/health', (req, res) => {
  res.json({ code: 0, status: 'ok' });
});


app.listen(PORT, () => {
  console.log(`图书管理系统已启动: http://localhost:${PORT}`);
});

module.exports = app;